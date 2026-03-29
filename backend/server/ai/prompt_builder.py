from langchain_core.prompts import ChatPromptTemplate


def build_suggestion_prompt():
    return ChatPromptTemplate.from_messages([
        ("system", "You are a helpful task management assistant. Provide suggestions for improving the task."),
        ("human", """
        Task: {title}
        Description: {description}
        Tags: {tags}
        
        Provide a brief suggestion (2-3 sentences) on how to improve this task or break it down into smaller steps.
        """)
    ])


def build_summarize_prompt():
    return ChatPromptTemplate.from_messages([
        ("system", "You are a helpful task management assistant. Summarize the user's tasks."),
        ("human", """
        Here are my tasks:
        {task_list}
        
        Provide a brief summary (3-5 sentences) of my task list, highlighting:
        - What I have completed
        - What I need to focus on
        - Any patterns or suggestions
        
        Keep it concise and actionable.
        """)
    ])
