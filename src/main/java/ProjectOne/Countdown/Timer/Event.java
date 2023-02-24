package ProjectOne.Countdown.Timer;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.NonNull;

import jakarta.annotation.Nonnull;

public class Event {
	
	private String name;
	private LocalDate date;
	private LocalTime time;
	
	public Event() {
	}
	public Event(String name, LocalDate date, LocalTime time) {
		this.name = name;
		this.date = date;
		this.time = time;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public LocalDate getDate() {
		return date;
	}
	public void setDate(LocalDate date) {
		this.date = date;
	}
	public LocalTime getTime() {
		return time;
	}
	public void setTime(LocalTime time) {
		this.time = time;
	}
	
	
}
