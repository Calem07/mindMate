package com.mindmate.service;

import com.mindmate.domain.ModerationAuditLog;
import com.mindmate.domain.User;
import com.mindmate.dto.AppDtos.*;
import com.mindmate.repository.*;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
  private final UserRepository users;
  private final JournalEntryRepository journals;
  private final ChatMessageRepository messages;
  private final CrisisEventRepository crisisEvents;
  private final ModerationAuditLogRepository auditLogs;

  public AdminService(UserRepository users, JournalEntryRepository journals, ChatMessageRepository messages,
      CrisisEventRepository crisisEvents, ModerationAuditLogRepository auditLogs) {
    this.users = users;
    this.journals = journals;
    this.messages = messages;
    this.crisisEvents = crisisEvents;
    this.auditLogs = auditLogs;
  }

  public List<UserSummary> users() {
    return users.findAll().stream()
        .map(user -> new UserSummary(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.isModerationConsent(), user.getCreatedAt()))
        .toList();
  }

  public List<ModerationItem> moderationItems(User admin) {
    var items = new ArrayList<ModerationItem>();
    users.findAll().stream().filter(User::isModerationConsent).forEach(user -> {
      journals.findByUserOrderByCreatedAtDesc(user).forEach(entry ->
          items.add(new ModerationItem("journal", user.getId(), user.getEmail(), entry.getContent(), entry.getCreatedAt())));
      messages.findByUserOrderByCreatedAtAsc(user).forEach(message ->
          items.add(new ModerationItem("chat", user.getId(), user.getEmail(), message.getContent(), message.getCreatedAt())));
      audit(admin, "VIEW_MODERATION_CONTENT", user.getId());
    });
    return items;
  }

  public List<CrisisEventResponse> crisisEvents() {
    return crisisEvents.findAll().stream()
        .map(event -> new CrisisEventResponse(event.getId(), event.getUser().getId(), event.getTriggerPhrase(), event.getSourceText(), event.getCreatedAt()))
        .toList();
  }

  private void audit(User admin, String action, Long targetUserId) {
    var log = new ModerationAuditLog();
    log.setAdminUser(admin);
    log.setAction(action);
    log.setTargetUserId(targetUserId);
    auditLogs.save(log);
  }
}
