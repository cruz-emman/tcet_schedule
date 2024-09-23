-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "contact_person" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "venue" TEXT,
    "event_date" TIMESTAMP(3) NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "does_have_dry_run" BOOLEAN NOT NULL DEFAULT false,
    "dry_run_date" TIMESTAMP(3),
    "dry_run_start_time" TEXT,
    "dry_run_end_time" TEXT,
    "does_have_assistance" TEXT NOT NULL,
    "name_of_assistance" JSONB,
    "meeting_type_option" TEXT,
    "meeting_type_service" TEXT,
    "reminder" TEXT,
    "panelist" JSONB,
    "meeting_type_link" TEXT,
    "camera_setup" TEXT,
    "status" TEXT NOT NULL,
    "other_training" TEXT,
    "soft_delete" BOOLEAN NOT NULL DEFAULT false,
    "editedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleDate" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "soft_delete_scheduleDate" BOOLEAN NOT NULL DEFAULT false,
    "appointmentId" TEXT NOT NULL,

    CONSTRAINT "ScheduleDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalDates" (
    "additonalDateId" TEXT NOT NULL,
    "additional_date" TIMESTAMP(3) NOT NULL,
    "additional_start" TEXT NOT NULL,
    "additional_end" TEXT NOT NULL,
    "additional_status" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,

    CONSTRAINT "AdditionalDates_pkey" PRIMARY KEY ("additonalDateId")
);

-- CreateTable
CREATE TABLE "_AppointmentToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ScheduleDate_appointmentId_idx" ON "ScheduleDate"("appointmentId");

-- CreateIndex
CREATE INDEX "AdditionalDates_appointmentId_additonalDateId_idx" ON "AdditionalDates"("appointmentId", "additonalDateId");

-- CreateIndex
CREATE UNIQUE INDEX "_AppointmentToUser_AB_unique" ON "_AppointmentToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AppointmentToUser_B_index" ON "_AppointmentToUser"("B");

-- AddForeignKey
ALTER TABLE "ScheduleDate" ADD CONSTRAINT "ScheduleDate_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalDates" ADD CONSTRAINT "AdditionalDates_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToUser" ADD CONSTRAINT "_AppointmentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToUser" ADD CONSTRAINT "_AppointmentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
