import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface
from elevenlabs.conversational_ai.conversation import Conversation, ConversationInitiationData

load_dotenv()

# Initialize ElevenLabs client
client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

# Replace with your agent ID from the ElevenLabs platform
# You can find this in your agent settings at https://elevenlabs.io/app/conversational-ai
agent_id = os.getenv("ELEVENLABS_AGENT_ID", "YOUR_AGENT_ID_HERE")

# Set up dynamic variables for personalization
dynamic_vars = {
    "name": "John Smith",  # Replace with actual user name
    "student_year": "Third Year Undergraduate",  # Replace with actual student year
    "university_name": "Imperial College London"  # Replace with actual university
}

# Create configuration with dynamic variables
config = ConversationInitiationData(
    dynamic_variables=dynamic_vars
)

# Create conversation with your agent
conversation = Conversation(
    client=client,
    agent_id=agent_id,
    requires_auth=True,  # Set to False if your agent is public
    audio_interface=DefaultAudioInterface(),
    config=config,
    callback_agent_response=lambda response: print(f"Agent: {response}"),
    callback_user_transcript=lambda transcript: print(f"User: {transcript}"),
)

print("Starting conversation with your agent...\n")

# Start the conversation session
conversation.start_session()

# Wait for the session to end
conversation_id = conversation.wait_for_session_end()
print(f"\nConversation ended. ID: {conversation_id}")
