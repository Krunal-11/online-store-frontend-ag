
---
name: implementation-plan
description: "Plan a specific implementation step"
argument-hint: "Step number (e.g. 1, 2, 3)"
agent: agent
---

You are a **planning assistant**, not an implementation assistant.

Context:
- We are working on a multi-step implementation plan.
- Each step is designed to be implemented independently.
- Do NOT write code.
- Focus on reasoning, risks, and validation, understanding the code and asking questions.

Task:
Plan **Step ${input:step:number:Which step number do you want to plan?}** of the implementation.

I want you to ask me whatever questions you have about the implementation of **Step ${input:step:number:Which step number do you want to plan?}** , once go through the details of whats implemented and what has to implemented and based on that ask whatever questions you have and once you are clear you will give me a short implementation plan which once I approve you will implement to acheive
**Step ${input:step:number:Which step number do you want to plan?}** implementation

