

import { db } from '../config/db.js'


const COLUMNS = {
    title: 'title',
    slug: 'slug',
    summary: 'summary',
    description: 'description',
    repoUrl: 'repo_url',
    demoUrl: 'demo_url',
    featured: 'featured',
    status: 'status',
    order: 'sort_order',
}


function toProject(row) {

    return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        summary: row.summary,

        description: row.description,
        repoUrl: row.repo_url,
        demoUrl: row.demo_url,
        order: row.sort_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at,

        featured: Boolean(row.featured),
        tech: row.tech ? JSON.parse(row.tech) : [],
    
        status: row.status,
        cover: row.cover_url,
        
    }


}

async function linkTechnologies(tx, projectId, techList) {
    for (const name of techList) {
        await tx.execute({
            sql: 'INSERT INTO technologies (name) VALUES (?) ON CONFLICT(name) DO NOTHING',
            args: [name],
        })
        const { rows } = await tx.execute({
            sql: 'SELECT id FROM technologies WHERE name = ?',
            args: [name],
        })
        await tx.execute({
            sql: 'INSERT INTO project_technologies (project_id, technology_id) VALUES (?, ?)',
            args: [projectId, rows[0].id],
        })
    }
}


class ModelProyectos {

    static async create(project) {
        const tx = await db.transaction('write');


        try {
            const result = await tx.execute({
                sql: `INSERT INTO projects
              (title, slug, summary, description, repo_url, demo_url, featured, status, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    project.title,
                    project.slug,
                    project.summary,
                    project.description,
                    project.repo_url,
                    project.demo_url,
                    project.featured ? 1 : 0,
                    project.status,
                    project.sort_order ?? 0,
                ],
            });

            const projectId = Number(result.lastInsertRowid);


            linkTechnologies(tx, projectId, project.tech || []);

            await tx.commit();
            return projectId;

        } catch (err) {
            await tx.rollback();
            throw err;

        } finally {
            tx.close();

        }
    }

    static async findAll({ includeDrafts = false } = {}) {
        const where = includeDrafts ? '' : "WHERE p.status = 'published'"

        const { rows } = await db.execute(`
            SELECT
            p.*,
            json_group_array(t.name) FILTER (WHERE t.name IS NOT NULL) AS tech
            FROM projects AS p
            LEFT JOIN project_technologies AS pt ON pt.project_id = p.id
            LEFT JOIN technologies AS t          ON t.id = pt.technology_id
            ${where}
            GROUP BY p.id
            ORDER BY p.featured DESC, p.sort_order ASC
        `)

        return rows.map(toProject)
    }


    static async getById(id) {

        const { rows } = await db.execute({
            sql: `SELECT p.*, json_group_array(t.name) FILTER (WHERE t.name IS NOT NULL) AS tech FROM projects p
            LEFT JOIN project_technologies pt ON p.id = pt.project_id 
            LEFT JOIN technologies t ON pt.technology_id = t.id
            WHERE p.id = ? GROUP BY p.id
            `,
            args: [id],
        });


        return rows.length > 0 ? toProject(rows[0]) : null;
    }


    static async deleteProject(id) {

        const [, projectResult] = await db.batch([
            {
                sql: 'DELETE FROM project_technologies WHERE project_id = ?',
                args: [id],
            },
            {
                sql: 'DELETE FROM projects WHERE id = ?',
                args: [id],
            }
        ]);

        return projectResult.rowsAffected > 0;
    }

    static async patchProject(id, changes) {

        const tx = await db.transaction('write');

        try {
            const { rows } = await tx.execute({
                sql: `SELECT * FROM projects WHERE id = ?`,
                args: [id],
            })
            if (rows.length === 0) {
                await tx.rollback()
                return false

            }

            const sets = []
            const args = []

            for (const [key, value] of Object.entries(changes)) {
                const column = COLUMNS[key]
                if (!column) continue

                sets.push(`${column} = ?`)
                args.push(key === 'featured' ? (value ? 1 : 0) : value)
            }
            if (sets.length > 0) {
                await tx.execute({
                    sql: `UPDATE projects SET ${sets.join(', ')} WHERE id = ?`,
                    args: [...args, id],
                })
            }

            if (changes.tech !== undefined) {
                await tx.execute({
                    sql: 'DELETE FROM project_technologies WHERE project_id = ?',
                    args: [id],
                })
                await linkTechnologies(tx, id, changes.tech)
            }


            await tx.commit()
            return true;
        }catch(err){
            await tx.rollback();
            throw err
        }finally{
            tx.close();
        }
    }

    // Devuelve { publicId } de la portada actual, o null si el proyecto no existe.
    static async getCover(id) {
        const { rows } = await db.execute({
            sql: 'SELECT cover_public_id FROM projects WHERE id = ?',
            args: [id],
        })
        if (rows.length === 0) return null
        return { publicId: rows[0].cover_public_id ?? null }
    }

    // Guarda (o limpia, con null) la portada de un proyecto.
    static async setCover(id, url, publicId) {
        const result = await db.execute({
            sql: 'UPDATE projects SET cover_url = ?, cover_public_id = ? WHERE id = ?',
            args: [url, publicId, id],
        })
        return result.rowsAffected > 0
    }
}


export default ModelProyectos
