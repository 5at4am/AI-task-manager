from langchain_core.prompts import ChatPromptTemplate


def build_suggestion_prompt() -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages([
        ("system", (
            "You are a productivity assistant. "
            "When given a task, respond with:\n"
            "1. Suggested priority (low / medium / high) with a short reason\n"
            "2. 3-5 actionable sub-steps to complete the task\n"
            "3. 2-3 relevant tag suggestions\n"
            "Be concise and practical."
        )),
        ("human", (
            "Task title: {title}\n"
            "Description: {description}\n"
            "Current tags: {tags}"
        )),
    ])


def build_summarize_prompt() -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages([
        ("system", (
            "You are a productivity assistant. "
            "When given a task list, respond with:\n"
            "1. A brief overall summary of what's being worked on\n"
            "2. Key bottlenecks or overdue concerns\n"
            "3. Suggested next actions to move things forward\n"
            "Keep it concise and actionable."
        )),
        ("human", "Here is the task list:\n\n{task_list}"),
    ])
