export async function getUserFromMention(userManager, mention) {
	const matches = mention.match(/^<@!?(\d+)>$/);

	if (!matches) return undefined;

	const id = matches[1];

	return userManager.cache.get(id) || await userManager.fetch(id);
}

export function getChannelFromMention(channelManager, mention) {
  const matches = mention.match(/^<#(\d+)>$/);

	if (!matches) return undefined;

	const id = matches[1];

	return channelManager.cache.get(id);
}

export function getRoleFromMention(roleManager, mention) {
  const matches = mention.match(/^<@&(\d+)>$/);

	if (!matches) return undefined;

	const id = matches[1];

	return roleManager.cache.get(id);
}