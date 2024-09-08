import { varchar, text,uniqueIndex, timestamp, pgTable, primaryKey, uuid, pgEnum, integer } from "drizzle-orm/pg-core";

export const UserRole = pgEnum("userRole", ["ADMIN", "STAFF","DOCTOR"])
export const UserStatus = pgEnum("userStatus", ["ACTIVE", "INACTIVE"])
export const UserTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom().unique(), // set as primary key
  name: varchar("name"),
  email: varchar("email").notNull(),
  password: text("password"),
  profileImage: varchar("image"), // Ensure this is correctly added
  phoneNumber: varchar("phoneNumber"),
  address: varchar("address"),
  status: UserStatus("userStatus").default("ACTIVE"),
  role: UserRole("userRole").default("ADMIN").notNull(), // Ensure this remains unchanged
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
},
 table => {
  return {
    emailIndex: uniqueIndex("emailIndex").on(table.email)
  }
});



export const PatientStatus = pgEnum("patientStatus", ["PENDING", "INTREATMENT", "FINISHED"]) 
export const PatientTable = pgTable("patient", {
  id: uuid("id").primaryKey().defaultRandom().unique(), // set as primary key
  name: varchar("name"),
  age: integer("age"),
  address: varchar("address"),
  phoneNumber: integer("phoneNumber").notNull(),
  todayTurn: integer("turnNumber"),
  status: PatientStatus("patientStatus"),
  diagnose: varchar("diagnose"),
  detailedDiagnose: varchar("description"),
  xRay: varchar("image"),
  doctor: uuid("userId"). references(() => UserTable.id),
  treatment: varchar("treatment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, table => {
  return {
    patientPhoneNumberIndex: uniqueIndex("patientPhoneNumberIndex").on(table.phoneNumber)
  }
});

export const PatientFeeTable = pgTable("fees", {
  id: uuid("id").primaryKey().defaultRandom().unique(), // primary key for the fee
  totalAmount: integer("totalAmount"),
  checkUpFee: integer("checkUpFee"),
  initialAmountPaid: integer("initialAmount"),
  // userId: uuid("userId").references(() => UserTable.id), // reference to User table
  amountRemaining: integer("amountRemaining"),
  patientId: uuid("patientId").references(() => PatientTable.id), // renamed to avoid conflict
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const PatientHistoryTable = pgTable("history", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  name: varchar("name"),
  phoneNumber: integer("phoneNumber"),
  feeId: uuid("feeId").references(() => PatientFeeTable.id),
  diagnose: varchar("diagnose"),
  diagnoseDescription: varchar("description"),
  xRay: varchar("xRayImage"),
  doctor: uuid("userId"). references(() => UserTable.id),
  treatment: varchar("treatment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, table => {
  return {
    phoneNumberIndex: uniqueIndex("phoneNumberIndex").on(table.phoneNumber)
  }
});
