# Data storage

All student data is stored in the **browser** (`localStorage`), not on the server.

| Key | Contents |
|-----|----------|
| `pf_accounts` | Local login accounts |
| `pf_user` | Current user |
| `pf_profile` | CGPA, interests, goals, etc. |
| `pf_skills` | Skill list |
| `pf_quiz` | Quiz scores |
| `pf_recommendation` | Last AI recommendation |
| `pf_chat` | Chat history |

The backend only forwards profile data to OpenAI and returns the response.
