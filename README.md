# cli-ai-code-review
CLI Code Review powered by ChatGPT

# Setup
Make sure you have at least Node18 and `npx` in your path. Sign up for an OpenAPI API key and set it as an environment variable `OPENAI_API_KEY`

# Usage

With changes in your current git directory, run:

```
npx cli-ai-code-review
```

This will submit the output of a `git diff` to ChatGPT
