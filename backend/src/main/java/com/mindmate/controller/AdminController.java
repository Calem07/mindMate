package com.mindmate.controller;

import com.mindmate.dto.AppDtos.*;
import com.mindmate.service.AdminService;
import com.mindmate.service.CurrentUserService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  private final AdminService admin;
  private final CurrentUserService currentUser;

  public AdminController(AdminService admin, CurrentUserService currentUser) {
    this.admin = admin;
    this.currentUser = currentUser;
  }

  @GetMapping("/users")
  public List<UserSummary> users() {
    return admin.users();
  }

  @GetMapping("/moderation/content")
  public List<ModerationItem> moderationContent() {
    return admin.moderationItems(currentUser.get());
  }

  @GetMapping("/crisis-events")
  public List<CrisisEventResponse> crisisEvents() {
    return admin.crisisEvents();
  }
}
