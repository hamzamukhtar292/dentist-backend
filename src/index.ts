import "dotenv/config"
import {db } from "./drizzle/db";
import { UserTable } from "./drizzle/schema";

async function main() {
    // await db.delete(UserTable)
    await db.insert(UserTable).values({
        name: "Hamza",
        email: "hamzamukhtar292@gmail.com",
        password: "securepassword", // Consider hashing passwords in production
        profileImage: "profile.jpg",
        phoneNumber: "1234567890",
        address: "1234 Street, City, Country",
        role: "ADMIN", // Role set to ADMIN
        status: "ACTIVE", // Status set to ACTIVE
    })
    const user = await db.query.UserTable.findFirst()
    console.log(user);
}

main()