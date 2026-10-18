import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../models/modelUsers.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.validated.body

    const user = await UserModel.findByEmail(email)

    // Si no existe el usuario O la contraseña no coincide → el MISMO mensaje
    const passwordOk = user && (await bcrypt.compare(password, user.password_hash))

    if (!passwordOk) {
      return res.status(401).json({
        message: 'Email o contraseña incorrectos',
        success: false,
      })
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' },
    )

    return res.status(200).json({
      message: 'Sesión iniciada',
      data: { token, user: { id: user.id, email: user.email } },
      success: true,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Error al iniciar sesión', success: false })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado', success: false })
    }

    return res.status(200).json({ data: user, success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Error al obtener el usuario', success: false })
  }
}