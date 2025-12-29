package com.kitabqurdu.service;

import com.kitabqurdu.dto.SavedFilterRequest;
import com.kitabqurdu.model.SavedFilter;
import com.kitabqurdu.model.User;
import com.kitabqurdu.repository.SavedFilterRepository;
import com.kitabqurdu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SavedFilterService {

    @Autowired
    private SavedFilterRepository savedFilterRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public SavedFilter createSavedFilter(Long userId, SavedFilterRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SavedFilter savedFilter = new SavedFilter();
        savedFilter.setUser(user);
        savedFilter.setName(request.getName());
        savedFilter.setFilterCriteria(request.getFilterCriteria());
        savedFilter.setNotificationEnabled(request.getNotificationEnabled() != null ? 
                request.getNotificationEnabled() : true);

        return savedFilterRepository.save(savedFilter);
    }

    public List<SavedFilter> getUserSavedFilters(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return savedFilterRepository.findByUser(user);
    }

    public SavedFilter getSavedFilterById(Long filterId, Long userId) {
        SavedFilter filter = savedFilterRepository.findById(filterId)
                .orElseThrow(() -> new RuntimeException("Saved filter not found"));

        if (!filter.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        return filter;
    }

    @Transactional
    public SavedFilter updateSavedFilter(Long filterId, Long userId, SavedFilterRequest request) {
        SavedFilter filter = getSavedFilterById(filterId, userId);

        if (request.getName() != null) {
            filter.setName(request.getName());
        }
        if (request.getFilterCriteria() != null) {
            filter.setFilterCriteria(request.getFilterCriteria());
        }
        if (request.getNotificationEnabled() != null) {
            filter.setNotificationEnabled(request.getNotificationEnabled());
        }

        return savedFilterRepository.save(filter);
    }

    @Transactional
    public void deleteSavedFilter(Long filterId, Long userId) {
        SavedFilter filter = getSavedFilterById(filterId, userId);
        savedFilterRepository.delete(filter);
    }

    public List<SavedFilter> getFiltersWithNotificationsEnabled() {
        return savedFilterRepository.findByNotificationEnabledTrue();
    }
}
