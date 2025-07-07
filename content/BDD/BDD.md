# Behavior Driven Development (BDD)

**BDD** is a collaborative approach to software development that encourages communication between developers, QA, and non-technical stakeholders by using examples written in natural language.

## 🧩 Key Concepts

- Focus on **behavior**, not implementation
- Uses **ubiquitous language** shared by the team
- Scenarios describe how the system *should behave* in different situations

## 📄 Feature File Structure (Gherkin Syntax)

```gherkin
Feature: Login functionality

  Scenario: Successful login
    Given the user is on the login page
    When they enter valid credentials
    Then they should be redirected to the dashboard

  Scenario: Login failure with wrong password
    Given the user is on the login page
    When they enter an incorrect password
    Then an error message should be displayed
```

- `Feature:` describes the feature under test
- `Scenario:` describes a specific example of behavior
- `Given/When/Then` describe the steps clearly

## ✅ Benefits of BDD

| Benefit                       | Description                                         |
|------------------------------|-----------------------------------------------------|
| **Improved communication**   | Everyone understands what the system should do      |
| **Living documentation**     | Feature files double as specs                       |
| **Test automation ready**    | Easily plugged into tools like Cucumber or Behave   |
| **Prevents rework**          | Clarifies requirements before coding starts         |

## 🧪 Popular BDD Tools

| Tool        | Language        | Description                          |
|-------------|------------------|--------------------------------------|
| **Cucumber**| Ruby, Java, JS   | Most popular BDD tool using Gherkin  |
| **Behave**  | Python           | Pythonic implementation of BDD       |
| **SpecFlow**| C#/.NET          | Gherkin for the Microsoft ecosystem  |
| **Jest + Jest-Cucumber** | JavaScript | Lightweight for Node.js projects |

## 🧠 Tips

- Start with conversations, not code
- Keep scenarios short and focused
- Don’t automate *everything*—prioritize valuable behaviors

> “BDD is not about testing. It’s about communication.” — Dan North
