package ProjectOne.Countdown.Timer;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CountdownTimerController {
	@GetMapping("/countdown")
	public String GetEvent(Model model) {
        model.addAttribute("Event", new Event());
		return "countdown";
	}
}