#!/usr/bin/env node
/**
 * Review pending changes using git-diff
 */
import { simpleGit } from 'simple-git';
import OpenAI from 'openai';
import cliMd from 'cli-markdown';

const PROMPT = `You are a code-review bot.
You are receiving the output of a git diff. The code is from a TypeScript repository.

Please respond with feedback using markdown formatting.
`;

async function main() {
	const git = simpleGit({
		baseDir: process.cwd(),
	});
	// Look at only staged changes, so we're making sure we're reviewing what's going to be committed
	// This also helps to make sure added files are included
	const diff = (await git.diff(['--staged'])).trim();
	if (!diff.length) {
		console.log('No Changes');
		return;
	}
	console.log(diff);
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: PROMPT,
			},
			{
				role: 'user',
				content: diff,
			},
		],
		model: 'gpt-4',
	 });
	for (const choice of chatCompletion.choices) {
		if (choice.message.content) {
			console.log('');
			console.log('--------------------------------------------------------------');
			console.log('');
			console.log(cliMd(choice.message.content));
		}
	}
}
main();
