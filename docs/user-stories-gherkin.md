# SOCOS User Stories — Gherkin Format

**Project:** SOCOS CRM  
**Format:** Gherkin (Given-When-Then)  
**Updated:** 2026-04-23

---

## Contact Management

### US-01: Add a new contact

```
Feature: Contact Management

  Scenario: User adds a contact with required fields only
    Given I am authenticated on the dashboard
    And I am viewing the contact list
    When I click "Add Contact"
    And I enter "Sarah" as first name
    And I click "Create Contact"
    Then I should see a success toast "Contact created!"
    And the modal should close
    And "Sarah" should appear in the contact list
    And the contact count should increase by 1

  Scenario: User adds a contact with all fields
    Given I am authenticated on the dashboard
    And I am viewing the contact list
    When I click "Add Contact"
    And I enter "John" as first name
    And I enter "Doe" as last name
    And I enter "Acme Inc" as company
    And I enter "CEO" as job title
    And I enter "Friend, Networking" as labels
    And I enter "1990-05-15" as birthday
    And I click "Create Contact"
    Then I should see a success toast "Contact created!"
    And the modal should close
    And the new contact should have all provided data

  Scenario: User tries to add contact without first name
    Given I am authenticated on the dashboard
    And I click "Add Contact"
    When I leave first name empty
    And I click "Create Contact"
    Then I should see "First name is required" error
    And the contact should NOT be created

  Scenario: User cancels adding a contact
    Given I am authenticated on the dashboard
    And I click "Add Contact"
    When I fill in "Test" as first name
    And I click "Cancel"
    Then the modal should close
    And no contact should be created
    And the contact list should be unchanged
```

---

### US-02: View and search contacts

```
Feature: Contact Search

  Scenario: View all contacts
    Given I am authenticated on the dashboard
    And I have 5 contacts in my list
    When I view the contact list
    Then I should see all 5 contacts displayed
    And each contact should show name, company, and labels

  Scenario: Search contacts by name
    Given I am authenticated on the dashboard
    And I have contacts named "Sarah Chen", "John Doe", "Bob Smith"
    When I search for "Sarah"
    Then I should see "Sarah Chen" in results
    And I should NOT see "John Doe" or "Bob Smith"

  Scenario: Search contacts by company
    Given I am authenticated on the dashboard
    And I have contacts at companies "Google", "Meta", "Apple"
    When I search for "Apple"
    Then I should see contacts from "Apple"
```

---

### US-03: Filter contacts by label

```
Feature: Contact Filtering

  Scenario: Filter by label "Networking"
    Given I am authenticated on the dashboard
    And I have contacts with labels "Networking" and "Friend"
    When I click filter "Networking"
    Then I should see only contacts tagged "Networking"

  Scenario: Clear filter
    Given I am authenticated on the dashboard
    And I have an active label filter
    When I click filter "All"
    Then I should see all my contacts
```

---

### US-04: View contact details

```
Feature: Contact Details

  Scenario: View contact profile
    Given I am authenticated on the dashboard
    And I have a contact named "Sarah Chen"
    When I click on "Sarah Chen"
    Then I should see her full profile
    And I should see her company, job title, birthday
    And I should see her labels
    And I should see interaction history
```

---

### US-05: XP earned on contact creation

```
Feature: Gamification

  Scenario: Earn XP when creating contact
    Given I am authenticated on the dashboard
    And my current XP is 100
    When I create a new contact
    Then I should earn +10 XP
    And my XP total should be 110
    And my XP progress bar should update
```

---

## Authentication

### US-06: Login with valid credentials

```
Feature: Authentication

  Scenario: Successful login
    Given I am on the /dashboard page
    And I am not authenticated
    When I enter "yev.rachkovan@gmail.com" as email
    And I enter "socos2026" as password
    And I click "Sign In"
    Then I should be redirected to the dashboard
    And I should see my user profile (name, level, XP)
    And a JWT token should be stored in localStorage

  Scenario: Failed login with wrong password
    Given I am on the /dashboard page
    And I am not authenticated
    When I enter "yev.rachkovan@gmail.com" as email
    And I enter "wrongpassword" as password
    And I click "Sign In"
    Then I should see an error message "Login failed"
    And I should remain on the login page

  Scenario: Logout clears session
    Given I am authenticated on the dashboard
    When I click "Logout"
    Then my session should be cleared
    And I should be redirected to the login page
```

---

## Dashboard Stats

### US-07: Dashboard displays correct stats

```
Feature: Dashboard Stats

  Scenario: Stats display after login
    Given I am authenticated on the dashboard
    And I have 5 contacts
    When the dashboard loads
    Then I should see "5" as total contacts
    And I should see my current level
    And I should see my total XP
    And I should see XP progress bar

  Scenario: Stats update after adding contact
    Given I am authenticated on the dashboard
    And my stats show "5" contacts
    When I add a new contact
    Then my stats should update to show "6" contacts
```

---

## API Security

### US-08: API rejects unauthenticated requests

```
Feature: API Security

  Scenario: Unauthenticated contact list request
    When I send GET /api/contacts without a token
    Then I should receive 401 Unauthorized

  Scenario: Unauthenticated contact creation
    When I send POST /api/contacts without a token
    Then I should receive 401 Unauthorized

  Scenario: Health check is public
    When I send GET /api/health-check
    Then I should receive 200 OK
```
