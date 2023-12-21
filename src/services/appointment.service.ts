// services/appointmentService.ts
import { AppointmentModel } from '@models/appointment.model';
import { MentorModel } from '@models/mentor.model';
class AppointmentService {
 

  // Check if the time slot is available
  public isTimeSlotAvailable = async (mentorId: number, date: Date, time: string): Promise<boolean> => {
    try {
      const existingAppointment = await AppointmentModel.findOne({
        where: {
          mentorId,
          date,
          time,
        },
      });

      return !existingAppointment; // Return true if the slot is available, false if already booked
    } catch (error) {
      throw new Error('Error checking availability of the time slot');
    }
  };

  // Book appointment
  public bookAppointment = async (mentorId: number, menteeId: number, date: Date, time: string): Promise<AppointmentModel> => {
    try {
      const isSlotAvailable = await this.isTimeSlotAvailable(mentorId, date, time);

      if (!isSlotAvailable) {
        throw new Error('Selected time slot is not available');
      }

          // Increment mentorshipCount in MentorModel
    const mentor = await MentorModel.findByPk(mentorId);
    if (!mentor) {
      throw new Error('Mentor not found');
    }

    mentor.mentorshipCount += 1
    await mentor.save();
    
      const newAppointment = await AppointmentModel.create({
        mentorId,
        menteeId,
        date,
        time,
      });

      return newAppointment;
    } catch (error) {
      throw new Error(`Unable to book the appointment: ${error.message}`);
    }
  };

  // Update appointment time
  public updateAppointmentTime = async (appointmentId: number, newTime: string): Promise<AppointmentModel> => {
    try {
      const appointment = await AppointmentModel.findByPk(appointmentId);

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      const isSlotAvailable = await this.isTimeSlotAvailable(appointment.mentorId, appointment.date, newTime);

      if (!isSlotAvailable) {
        throw new Error('Selected time slot is not available');
      }

      appointment.time = newTime;
      await appointment.save();

      return appointment;
    } catch (error) {
      throw new Error(`Unable to update the appointment time: ${error.message}`);
    }
  };

  
  // Cancel appointment
  public cancelAppointment = async (appointmentId: number): Promise<number> => {
    try {
      const deletedRowsCount = await AppointmentModel.destroy({
        where: {
          id: appointmentId,
        },
      });

      return deletedRowsCount;
    } catch (error) {
      throw new Error(`Unable to cancel the appointment: ${error.message}`);
    }
  };

   // Get all appointments
   public getAllAppointments = async (): Promise<AppointmentModel[]> => {
    try {
      const appointments = await AppointmentModel.findAll();
      return appointments;
    } catch (error) {
      throw new Error(`Unable to fetch appointments: ${error.message}`);
    }
  };

   // Get all appointments for a specific mentor
   public getAppointmentsForMentor = async (mentorId: number): Promise<AppointmentModel[]> => {
    try {
      const appointments = await AppointmentModel.findAll({
        where: { mentorId },
      });
      return appointments;
    } catch (error) {
      throw new Error(`Unable to fetch appointments for mentor: ${error.message}`);
    }
  };

  // Get all appointments for a specific mentee
  public getAppointmentsForMentee = async (menteeId: number): Promise<AppointmentModel[]> => {
    try {
      const appointments = await AppointmentModel.findAll({
        where: { menteeId },
      });
      return appointments;
    } catch (error) {
      throw new Error(`Unable to fetch appointments for mentee: ${error.message}`);
    }
  };
  // Other existing methods...
}

export { AppointmentService };
