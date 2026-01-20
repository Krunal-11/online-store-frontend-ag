
---
name: details-file
description: "Generate step_X_details.md explaining technical changes for learning purposes"
argument-hint: "Step number (example: 6)"
agent: agent
---

You are acting as a **technical documentation assistant**.

### Context
- This project has multiple steps.
- For each step, a file named `step_<N>_details.md` exists inside the `details/` folder.
- These documents are written **after implementation**.
- Their goal is **learning and technical understanding**, not implementation instructions.

### Your Task
Create **`step_${input:step:number:Which step number?}_details.md`** inside the `details/` folder.

You MUST:
1. Review existing previously created `step_<N>_details.md` files (1 from any step) to understand:
   - Formatting style
   - Tone
   - Section structure
2. Follow **the same format and style** as previous step documents.
3. Document **only what is relevant to understand and learn** from this step.

### Important Guidelines
- ❌ Do NOT explain basics already covered in earlier steps.
- ❌ Do NOT add boilerplate, generic, or repeated explanations.
- ✅ Focus on **what changed in this step technically**.
- ✅ Explain *why* changes were introduced (where helpful).
- ✅ Assume the reader is technical but learning the project evolution and wants to learn technical implementation part.

### Content Focus Areas (only if applicable)
Include sections **only if relevant**:
- Architectural changes
- New patterns or abstractions introduced
- Refactors made and their motivations
- Dependency changes
- Configuration or environment updates
- Side effects or trade-offs introduced in this step
- Anything removed or deprecated

### Output Requirements
- Output **Markdown only**
- Use clean headings and concise bullet points
- Be precise and learning-focused
- Do NOT include code unless needed to clarify a concept
- Do NOT implement or modify files — documentation only

### Final Output
Generate the complete content of:

```text
details/step_${input:step}_details.md
