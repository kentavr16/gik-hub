import { NextResponse } from "next/server";
import sequelize from "@/database/dbInit";
import User from "@/models/User";
import Role from "@/models/Role";
const bcrypt = require("bcrypt");
import { hashPassword } from "@/helpers/hashGenerator";

export async function POST(req: Request) {
  const { username, password, email } = await req.json();
  User.belongsToMany(Role, { through: "UserRoles" });
  Role.belongsToMany(User, { through: "UserRoles" });
  const transaction = await sequelize.transaction();
  try {
    const hash = await bcrypt.hash(password, 10); // Хеширование пароля

    const newUser = await User.create({
      // Создание нового пользователя
      username: username,
      password: hash,
      email: email,
    });

    const role = await Role.findOne({
      where: { name: "user" },
    });

    await newUser.addRole(role);
    await transaction.commit();
    return NextResponse.json({ message: newUser }); // Ответ при успешном создании пользователя
  } catch (error: any) {
    if (transaction) await transaction.rollback();
    if (error.name === "SequelizeUniqueConstraintError") {
      console.error("Ошибка: Пользователь с таким именем уже существует");
      return NextResponse.json(
        { message: "Ошибка: Пользователь с таким именем уже существует" },
        { status: 405 }
      );
    } else {
      console.error("Ошибка при создании пользователя:", error);
      return NextResponse.json(
        { message: "Ошибка при создании пользователя" },
        { status: 500 }
      );
    }
  }
}
