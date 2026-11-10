Feature: User Authentication
  As an Amazon user
  I want to manage my account credentials
  So that I can securely access my account

  Background:
    Given I am on Amazon home page

  Scenario: TC-001 - New user registration with valid data
    When I click on Sign In button
    And I click on Create Account link
    And I enter email "newuser@gmail.com"
    And I enter name "John Doe"
    And I enter password "Test@123456"
    And I confirm password "Test@123456"
    And I click Create Account button
    Then I should see account created message
    And I should be logged in to dashboard
    And I should see "Welcome John Doe" message

  Scenario: TC-001 - Registration with invalid email format
    When I click on Sign In button
    And I click on Create Account link
    And I enter email "invalidemail"
    And I enter name "John Doe"
    And I enter password "Test@123456"
    And I confirm password "Test@123456"
    And I click Create Account button
    Then I should see error message "Invalid email format"

  Scenario: TC-001 - Registration with weak password
    When I click on Sign In button
    And I click on Create Account link
    And I enter email "newuser@gmail.com"
    And I enter name "John Doe"
    And I enter password "weak"
    And I confirm password "weak"
    And I click Create Account button
    Then I should see error message "Password must be at least 8 characters"

  Scenario: TC-002 - Login with valid credentials
    When I click on Sign In button
    And I enter email "testuser@gmail.com"
    And I enter password "Test@123456"
    And I click Sign In button
    Then I should be logged in successfully
    And I should see dashboard
    And I should see account menu with my email

  Scenario: TC-002 - Login with incorrect password
    When I click on Sign In button
    And I enter email "testuser@gmail.com"
    And I enter password "WrongPassword"
    And I click Sign In button
    Then I should see error message "Your password is incorrect"
    And I should remain on login page

  Scenario: TC-002 - Login with non-existent email
    When I click on Sign In button
    And I enter email "nonexistent@gmail.com"
    And I enter password "Test@123456"
    And I click Sign In button
    Then I should see error message "We cannot find an account"

  Scenario: TC-003 - Logout from account
    Given I am logged in as "testuser@gmail.com"
    When I click on Account & Lists menu
    And I click on Sign Out option
    Then I should be logged out successfully
    And I should see Sign In button
    And I should be redirected to home page

  Scenario: TC-003 - Session expires after logout
    Given I am logged in as "testuser@gmail.com"
    When I click on Account & Lists menu
    And I click on Sign Out option
    And I try to access account page directly
    Then I should be redirected to login page

  Scenario: TC-002 - Remember me functionality
    When I click on Sign In button
    And I enter email "testuser@gmail.com"
    And I enter password "Test@123456"
    And I check Remember Me checkbox
    And I click Sign In button
    Then I should be logged in successfully
    And my email should be pre-filled on next login attempt

  Scenario: TC-002 - Two-factor authentication setup
    Given I am logged in as "testuser@gmail.com"
    When I go to Account Settings
    And I click on Security Settings
    And I enable Two-Factor Authentication
    And I verify with phone number "+1234567890"
    Then I should see "2FA enabled successfully" message
    And I should receive OTP on login attempts
