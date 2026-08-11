---
name: phpunit-runner
description: Execute PHPUnit tests in JobAntenna's Docker environment (Laradock). Use when the user requests specific test files or filters, all PHPUnit tests, or verification of test results. Claude Code may delegate to the bundled test runner agent; other Agent Plugins clients execute the same workflow directly. 「PHPUnitテスト実行」「UserTestを実行」「テストを走らせて」「ApplicationTestの確認」などのリクエスト時に使用。
---

# JobAntenna PHPUnit Test Runner

## Overview

Execute PHPUnit tests within JobAntenna's Laradock-based Docker environment. The workflow is client-neutral: use the bundled `phpunit-test-runner` Agent when the client supports Claude plugin Agents, otherwise execute and monitor the same commands directly.

## When to Use This Skill

Invoke this skill when the user requests:
- "Run PHPUnit tests"
- "Execute UserTest"
- "Run tests for ApplicationTest"
- "Test the Application model"
- "Run all unit tests"
- "Execute tests/Unit/Models/ApplicationTest.php"

## Core Workflow

### 1. Identify Test Scope

Determine what tests to run based on user request:
- **Specific test class**: `--filter=UserTest`
- **Specific file**: `tests/Unit/Models/ApplicationTest.php`
- **All tests**: Run without filter

### 2. Execute or Delegate

Read [docker-environment.md](references/docker-environment.md), resolve the repository and Laradock locations from the current checkout, then run the requested scope.

- Claude Code: the bundled `phpunit-test-runner` Agent may execute and monitor the test
- Codex and other Agent Plugins clients: execute and monitor the test directly
- Do not require a client-specific delegation tool or hard-coded Agent identifier

The selected executor will:
1. Build the appropriate Docker command
2. Execute tests in the workspace container
3. Monitor execution progress
4. Parse results and generate a report

### 3. Report Results

Once the agent completes, summarize the test results to the user:
- Number of tests executed
- Pass/fail status
- Any errors or failures encountered

## Docker Environment Details

The JobAntenna project uses Laradock for Docker containerization. Resolve current paths using `references/docker-environment.md`; never depend on a personal absolute path.

### Quick Reference

- **Container**: workspace
- **Working directory**: `/var/www` (maps to server/)
- **PHPUnit path**: `./vendor/bin/phpunit`
- **PHPUnit version**: 9.6.16
- **Laradock location**: `../laradock` relative to project root

## Test Execution Commands

The test runner agent will use these commands:

### Via Docker Compose (Recommended)

```bash
cd /path/to/laradock
docker-compose exec workspace bash -c "./vendor/bin/phpunit [options]"
```

### Common Options

- `--filter=TestClassName` - Run specific test class
- `tests/Unit/SomeTest.php` - Run specific test file
- `--version` - Check PHPUnit version

## Example Usage

**User**: "Run the UserTest"

**Agent**:
1. Identify scope: `--filter=UserTest`
2. Resolve the current Laradock location
3. Execute directly or delegate when the client supports the bundled Agent
4. Report: "Executed 43 tests from UserTest. All tests passed successfully."

## Resources

### agents/phpunit-test-runner.md
Specialized agent for PHPUnit test execution in Docker environment.

### references/docker-environment.md
Detailed Docker environment configuration and troubleshooting guide.
