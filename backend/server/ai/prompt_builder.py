from langchain_core.prompts import ChatPromptTemplate


def build_suggestion_prompt():
    return ChatPromptTemplate.from_messages([
        ("system", "You are a helpful task management assistant. Provide suggestions for improving the task."),
        ("human", """Task: {title}
Description: {description}
Tags: {tags}

Provide a brief suggestion (2-3 sentences) on how to improve this task or break it down into smaller steps.""")
    ])


def build_summarize_prompt():
    return ChatPromptTemplate.from_messages([
        ("system", "You are a helpful task management assistant. Summarize the user's tasks."),
        ("human", """Here are my tasks:
{task_list}

Provide a brief summary (3-5 sentences) highlighting what's completed, what to focus on, and any suggestions. Keep it concise and actionable.""")
    ])


def build_prioritize_prompt():
    return ChatPromptTemplate.from_messages([
        ("system", """You are a productivity assistant. Your ONLY job is to re-rank the tasks the user gives you by urgency.

STRICT RULES:
- Only use the exact tasks provided. Do NOT add, invent, or infer any tasks.
- Output exactly as many lines as there are input tasks, no more, no less.
- Use this exact format for every line:
  <rank>. [URGENCY: HIGH|MEDIUM|LOW] <exact task title> -- <one sentence reason>
- No intro, no outro, no blank lines between items."""),
        ("human", """Rank ONLY these {count} tasks by urgency:

{task_list}

Output exactly {count} lines.""")
    ])


def build_breakdown_prompt():
    return ChatPromptTemplate.from_messages([
        ("system", """You are a productivity assistant that breaks vague tasks into concrete, actionable steps.

STRICT RULES:
- Return between 3 and 5 steps, no more, no less.
- Each step must be specific and immediately actionable.
- Use this exact format for every line:
  <step>. <short step title> :: <one sentence detail>
- No intro, no outro, no blank lines."""),
        ("human", """Break this task into 3-5 concrete sub-steps:

Task: {title}
Description: {description}""")
    ])
