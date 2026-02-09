import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, Clock } from "lucide-react";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM",
];

export default function BookingSection() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", guests: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length > 100) e.name = "Name too long";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit number";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Select a time slot";
    if (!form.guests) e.guests = "Select number of guests";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const text = encodeURIComponent(
      `Hi! I want to book a table for ${form.name.trim()} on ${form.date} at ${form.time} for ${form.guests} people. Please confirm.`
    );
   // window.open ki jagah ye use karein:
window.location.href = `https://wa.me/919630955951?text=${text}`;
  };

  const inputClass = (field: string) =>
    `w-full bg-background border ${
      errors[field] ? "border-destructive" : "border-border"
    } rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-forest/50 transition-colors`;

  return (
    <section id="booking" className="section-padding bg-card">
      <div className="container-cafe max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-forest font-semibold text-sm tracking-widest uppercase mb-2">Reservations</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-card-foreground">
            Book a Table
          </h2>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-5"
        >
          <div>
            <input
              type="text"
              placeholder="Your Name"
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass("name")}
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone Number (10 digits)"
              maxLength={10}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              className={inputClass("phone")}
            />
            {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={`${inputClass("date")} pl-10`}
                />
              </div>
              {errors.date && <p className="text-destructive text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className={`${inputClass("time")} pl-10 appearance-none`}
                >
                  <option value="">Select Time</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              {errors.time && <p className="text-destructive text-xs mt-1">{errors.time}</p>}
            </div>
          </div>

          <div>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className={`${inputClass("guests")} pl-10 appearance-none`}
              >
                <option value="">Number of Guests</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                ))}
              </select>
            </div>
            {errors.guests && <p className="text-destructive text-xs mt-1">{errors.guests}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-forest text-accent-foreground font-semibold py-3.5 rounded-lg hover:opacity-90 transition-opacity text-sm tracking-wide"
          >
            Confirm via WhatsApp →
          </button>
        </motion.form>
      </div>
    </section>
  );
}
