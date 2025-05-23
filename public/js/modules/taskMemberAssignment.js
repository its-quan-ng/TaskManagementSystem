// Task Member Assignment Module
window.initTaskMemberAssignment = function(taskData) {
  // Member assignment elements
  const memberDropdown = document.getElementById('memberDropdown');
  const memberDisplay = document.getElementById('memberDisplay');
  const addMemberBtn = document.getElementById('addMemberBtn');
  const addMoreMembersBtn = document.getElementById('addMoreMembersBtn');
  const memberList = document.getElementById('memberList');
  const memberSearchInput = document.getElementById('memberSearchInput');
  
  // Project members data
  let projectMembers = [];
  let assignedMembers = [];

  // Function to toggle member dropdown
  function toggleMemberDropdown() {
    if (!memberDropdown) return;
    
    memberDropdown.classList.toggle('show');
    if (memberDropdown.classList.contains('show')) {
      loadProjectMembers();
      if (memberSearchInput) {
        setTimeout(() => memberSearchInput.focus(), 100);
      }
    }
  }
  
  // Load assigned members when module initializes
  function loadTaskAssignments() {
    if (!taskData.taskId) return;
    
    fetch(`../../../api/task/GetTaskAssignments.php?task_id=${taskData.taskId}`)
      .then(response => {
        if (!response.ok) throw new Error('Error loading assigned members');
        return response.json();
      })
      .then(data => {
        if (data.success && data.assignments) {
          // Initialize assigned members from API data - load all members
          assignedMembers = data.assignments.map(a => parseInt(a.UserID));
          
          // Update UI with assigned members
          if (projectMembers.length > 0) {
            updateMemberDisplay();
          } else {
            // If no projectMembers yet, need to load for proper display
            loadProjectMembers();
          }
        } else {
          // Silent handling of warning without console.warn
        }
      })
      .catch(error => {
        // Silent handling of error without console.error
      });
  }
  
  // Load project members from API
  function loadProjectMembers() {
    if (!memberList) return;
    
    // Set loading state
    memberList.innerHTML = '<div class="no-members-message">Đang tải danh sách thành viên...</div>';
    
    fetch(`../../../api/project/GetProjectMembers.php?project_id=${taskData.projectId}`)
      .then(response => {
        if (!response.ok) throw new Error('Lỗi khi tải thành viên');
        return response.json();
      })
      .then(data => {
        if (data.success) {
          projectMembers = data.members || [];
          
          // If we don't have assigned members yet and there are member badges in the DOM, get them
          if (assignedMembers.length === 0) {
            const memberBadges = document.querySelectorAll('.member-badge');
            if (memberBadges.length > 0) {
              assignedMembers = Array.from(memberBadges).map(badge => parseInt(badge.dataset.memberId));
            }
            
            // If still no assigned members, try to load from API
            if (assignedMembers.length === 0) {
              loadTaskAssignments();
            }
          }
          
          renderMemberList();
        } else {
          memberList.innerHTML = `<div class="no-members-message">Lỗi: ${data.message || 'Không thể tải thành viên'}</div>`;
        }
      })
      .catch(error => {
        // Silent handling of error without console.error
        memberList.innerHTML = '<div class="no-members-message">Lỗi khi tải thành viên. Vui lòng thử lại.</div>';
      });
  }
  
  // Render member list with optional search filter
  function renderMemberList(searchTerm = '') {
    if (!memberList) return;
    
    if (projectMembers.length === 0) {
      memberList.innerHTML = '<div class="no-members-message">Không có thành viên trong dự án</div>';
      return;
    }
    
    // Filter members by search term if provided
    const filteredMembers = searchTerm 
      ? projectMembers.filter(member => 
          member.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.Email && member.Email.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : projectMembers;
    
    if (filteredMembers.length === 0) {
      memberList.innerHTML = '<div class="no-members-message">Không tìm thấy thành viên nào</div>';
      return;
    }
    
    // Generate member items HTML
    const membersHtml = filteredMembers.map(member => {
      const isSelected = assignedMembers.includes(parseInt(member.UserID));
      return `
        <div class="member-item ${isSelected ? 'selected' : ''}" data-member-id="${member.UserID}">
          <img src="../../../${member.Avatar}" alt="${member.FullName}">
          <span class="member-name">${member.FullName}</span>
          <svg class="member-check" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </div>
      `;
    }).join('');
    
    memberList.innerHTML = membersHtml;
    
    // Add click event listeners to member items
    document.querySelectorAll('.member-item').forEach(item => {
      item.addEventListener('click', function() {
        const memberId = parseInt(this.dataset.memberId);
        toggleMemberAssignment(memberId);
      });
    });
  }
  
  // Update member display in the UI
  function updateMemberDisplay() {
    if (!memberDisplay) return;
    
    if (assignedMembers.length === 0) {
      memberDisplay.innerHTML = `
        <button id="addMemberBtn" class="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Thêm thành viên
        </button>
      `;
      
      // Re-attach click event to the new button
      const newAddMemberBtn = document.getElementById('addMemberBtn');
      if (newAddMemberBtn) {
        newAddMemberBtn.addEventListener('click', function(event) {
          toggleMemberDropdown();
          event.stopPropagation();
        });
      }
    } else {
      // Generate HTML for all assigned members
      let assigneesHtml = '';
      
      // Display all assigned members
      for (const memberId of assignedMembers) {
        const memberData = projectMembers.find(m => parseInt(m.UserID) === memberId);
        if (memberData) {
          assigneesHtml += `
            <div class="member-badge" data-member-id="${memberData.UserID}">
              <img src="../../../${memberData.Avatar}" alt="${memberData.FullName}">
              <span>${memberData.FullName}</span>
              <span class="remove-member" role="button" tabindex="0" title="Xóa thành viên">×</span>
            </div>
          `;
        }
      }
      
      // Add the "Add more" button
      assigneesHtml += `
        <button id="addMoreMembersBtn" class="flex items-center text-indigo-600 hover:text-indigo-800 font-medium ml-2">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Thêm
        </button>
      `;
      
      memberDisplay.innerHTML = assigneesHtml;
      
      // Re-attach click event to the add more button
      const newAddMoreBtn = document.getElementById('addMoreMembersBtn');
      if (newAddMoreBtn) {
        newAddMoreBtn.addEventListener('click', function(event) {
          toggleMemberDropdown();
          event.stopPropagation();
        });
      }
    }
  }
  
  // Assign/unassign a member to the task
  function toggleMemberAssignment(memberId) {
    // Check if member is already assigned
    const isAssigned = assignedMembers.includes(memberId);
    
    if (isAssigned) {
      // Unassign member
      assignedMembers = assignedMembers.filter(id => id !== memberId);
      updateMemberAssignment(memberId, false);
    } else {
      // Assign member (without removing others)
      assignedMembers.push(memberId);
      updateMemberAssignment(memberId, true);
    }
    
    // Update the UI
    renderMemberList();
    updateMemberDisplay();
  }
  
  // Send member assignment update to the server
  function updateMemberAssignment(memberId, isAssigning) {
    if (!taskData.taskId) return;
    
    // Find member data to get name for logging
    const memberData = projectMembers.find(m => parseInt(m.UserID) === memberId);
    const memberName = memberData?.FullName || 'Thành viên';
    
    // Disable interactions during API call
    document.querySelectorAll('.member-item, .remove-member').forEach(el => {
      el.style.pointerEvents = 'none';
    });
    
    // Show a loading indicator in the member display
    if (memberDisplay) memberDisplay.classList.add('opacity-50');
    
    const action = isAssigning ? 'assign' : 'unassign';
    
    fetch('../../../api/task/UpdateTaskAssignment.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_id: taskData.taskId,
        user_id: memberId,
        action: action
      })
    })
    .then(response => {
      if (!response.ok) throw new Error('Lỗi khi cập nhật phân công');
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Update activity list with the new assignment
        const actionText = isAssigning 
          ? `đã giao nhiệm vụ cho ${memberName}`
          : `đã hủy giao nhiệm vụ cho ${memberName}`;
        window.taskActivityLogger.addNewActivity(actionText);
        
        // Show success notification
        window.taskNotification.show(isAssigning ? 'Đã giao nhiệm vụ thành công' : 'Đã hủy giao nhiệm vụ thành công');
        
        // Dispatch event with member name for detailed logging
        const event = new CustomEvent(isAssigning ? 'memberAssigned' : 'memberRemoved', {
          detail: { 
            memberId: memberId,
            memberName: memberName
          }
        });
        document.dispatchEvent(event);
      } else {
        // Revert the UI changes
        if (isAssigning) {
          assignedMembers = assignedMembers.filter(id => id !== memberId);
        } else {
          assignedMembers.push(memberId);
        }
        renderMemberList();
        updateMemberDisplay();
        
        // Show error
        alert('Lỗi: ' + (data.message || 'Không thể cập nhật phân công'));
      }
    })
    .catch(error => {
      // Silent handling of error without console.error
      
      // Revert the UI changes
      if (isAssigning) {
        assignedMembers = assignedMembers.filter(id => id !== memberId);
      } else {
        assignedMembers.push(memberId);
      }
      renderMemberList();
      updateMemberDisplay();
      
      alert('Lỗi: ' + error.message);
    })
    .finally(() => {
      // Re-enable interactions
      document.querySelectorAll('.member-item, .remove-member').forEach(el => {
        el.style.pointerEvents = '';
      });
      if (memberDisplay) memberDisplay.classList.remove('opacity-50');
    });
  }

  // Initialize event listeners
  function initEventListeners() {
    // Close dropdown when clicking outside
    window.addEventListener('click', function(event) {
      if (memberDropdown && !event.target.closest('.member-dropdown')) {
        memberDropdown.classList.remove('show');
      }
    });

    // Use event delegation for all member display interactions including removal
    if (memberDisplay) {
      memberDisplay.addEventListener('click', function(event) {
        // Handle member badge clicks (preventing dropdown open)
        if (event.target.closest('.member-badge') && !event.target.closest('.remove-member')) {
          event.stopPropagation();
          return;
        }
        
        // Handle remove-member clicks
        if (event.target.closest('.remove-member')) {
          const memberBadge = event.target.closest('.member-badge');
          if (memberBadge) {
            const memberId = parseInt(memberBadge.dataset.memberId);
            toggleMemberAssignment(memberId);
            event.stopPropagation();
            return;
          }
        }
        
        // Handle add member button clicks
        if (event.target.closest('#addMemberBtn') || event.target.closest('#addMoreMembersBtn')) {
          toggleMemberDropdown();
          event.stopPropagation();
        }
      });
    }

    // Search functionality
    if (memberSearchInput) {
      memberSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        renderMemberList(searchTerm);
      });
    }
  }
  
  // Initialize the module
  function init() {
    initEventListeners();
    loadTaskAssignments();
  }
  
  // Run initialization
  init();
  
  return {
    loadTaskAssignments,
    toggleMemberDropdown,
    renderMemberList,
    toggleMemberAssignment
  };
}
