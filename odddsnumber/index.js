import fs from 'fs';
import { watchFile, unwatchFile } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { tags, kata,
phrases, pembuka, linkPart, ajakanUlang, urlFormats, unbanz, akhir, leks
} from './data.js';
import {admin} from '../../../config.js'
import {ADMIN_ID} from '../../../start.js';

const maintenanceFile = './maintenance.json';

async function isMaintenance() {
  try {
    const data = JSON.parse(fs.readFileSync(maintenanceFile, 'utf-8'));
    return data.maintenance;
  } catch (e) {
    return false;
  }
}
async function setMaintenance(status) {
  fs.writeFileSync(maintenanceFile, JSON.stringify({ maintenance: status }, null, 2));
}

const BUG_FILE = './bug.json';
const CHANNEL_ID = '@wynexishere';
const GROUP_ID = -1002746671779;
const broadGroupFile = './broadgroup.json';
function pickTags(type) {
  if (!tags[type]) return "";
  const jumlah = Math.floor(Math.random() * 6) + 1;
  return tags[type]
    .sort(() => 0.5 - Math.random())
    .slice(0, jumlah)
    .join(" ");
}
const commandList = [
  "/start",
  "/wa",
  "/wafc",
  "/tban",
  "/spman",
  "/type",
  "/owner",
  "/reportbug",
  "/unban",
  "/ownermenu",
  "/setonlygb",
  "/gbid",
  "/addme",
  "/setbot",
  "/addprem",
  "/delprem",
  "/setpay",
  "/setfree",
  "/bl",
  "/unbl",
  "/allow",
  "/activebot",
  "/unallow",
  "/out",
  "/listgc",
  "/bcgc",
  "/cekgb",
  "/id",
  "/bc",
  "/chat",
  "/m",
  "/reply",
  "/replyadmin"
];
function readBroadGroups() {
  if (!fs.existsSync(broadGroupFile)) {
    fs.writeFileSync(broadGroupFile, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(broadGroupFile, 'utf-8'));
}

function writeBroadGroups(groups) {
  fs.writeFileSync(broadGroupFile, JSON.stringify(groups, null, 2));
}

function addBroadGroup(chatId) {
  let groups = readBroadGroups();
  if (!groups.includes(chatId)) {
    groups.push(chatId);
    writeBroadGroups(groups);
  }
}

function removeBroadGroup(chatId) {
  let groups = readBroadGroups().filter(id => id !== chatId);
  writeBroadGroups(groups);
}

const warnedFile = './warned.json';

function readWarned() {
  if (!fs.existsSync(warnedFile)) {
    fs.writeFileSync(warnedFile, JSON.stringify([]));
  }
  return new Set(JSON.parse(fs.readFileSync(warnedFile, 'utf-8')));
}

function writeWarned(set) {
  fs.writeFileSync(warnedFile, JSON.stringify([...set], null, 2));
}
const warnedUsers = readWarned();
function readBugs() {
  try {
    const data = fs.readFileSync(BUG_FILE, 'utf-8') || '{}';
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? {} : parsed;
  } catch {
    return {};
  }
}

function writeBugs(data) {
  try {
    fs.writeFileSync(BUG_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('⚠️ Gagal menulis bug.json:', e);
  }
}
const msgs = {
  judi: [
`{pembukaPilihan}
🎲 {mf1} {kata}
🎲 {mf2} 👁️ {namaweb}
🎲 {mf3} {kata}
🎲 {mf4}
🩸 {linkTxt}
💰 {mf5} | {mf6}
💰 {mf7} | {mf8}
👻 {kata} 👻
💀 {namaweb}
{akhirTxt}

{tags}`,

`👁️ {ajakanPilihan}
🎰 {mf1} | {mf2}
🎰 {mf3} | {mf4}
🩸 {kata} {namaweb}
{linkTxt}
💵 {mf5} | {mf6}
💵 {mf7} | {mf8}
👻 {kata}
{akhirTxt}

{tags}`,

`🔥 {pembukaPilihan} 🔥
[ {mf1} | {mf2} | {mf3} ]
[ {mf4} | {mf5} | {mf6} ]
{linkTxt}
🪙 {mf7} | {mf8}
🕷️ {kata} 🕷️ {namaweb}
{akhirTxt}

{tags}`
  ],

  porn: [
`🔥 {pembukaPilihan} 🔥
💋 {mf1} 👁️ {kata}
💋 {mf2} 💀 {namaweb}
💋 {mf3}
{linkTxt}
👠 {mf4}, {mf5}
🍑 {mf6}, {mf7}, {mf8}
🩸 {kata}
{akhirTxt}

{tags}`,

`⚠️ {ajakanPilihan}
💦 {mf1} | {mf2}
💦 {mf3} | {mf4}
{pembukaPilihan}
👁️ {linkTxt} 👁️
🍒 {mf5}, {mf6}, {mf7}
{mf8}
👻 {kata} — {namaweb}
{akhirTxt}

{tags}`,

`👄 {pembukaPilihan}
- {mf1}
- {mf2} {kata}
- {mf3}
{linkTxt}
💃 {mf4}, {mf5}, {mf6}
👠 {mf7}, {mf8}
💀 {namaweb}
{akhirTxt}

{tags}`
  ],

  narkoba: [
`💊 {pembukaPilihan}
{mf1} | {mf2} | {mf3}
🧪 {ajakanPilihan}
{linkTxt}
💉 {mf4}
💉 {mf5}, {mf6}, {mf7}, {mf8}
👻 {kata} 👻
💀 {namaweb}
{akhirTxt}

{tags}`,

`🕷️ {ajakanPilihan}
🌿 {mf1}
🌿 {mf2} {kata}
🌿 {mf3}
🌿 {mf4}
{pembukaPilihan}
🧪 {linkTxt}
🚬 {mf5}, {mf6}, {mf7}, {mf8}
☠️ {namaweb}
{akhirTxt}

{tags}`,

`🧟‍♂️ {pembukaPilihan}
[{mf1}] - [{mf2}]
[{mf3}] - [{mf4}]
{linkTxt}
💨 {mf5} + {mf6}
💨 {mf7} + {mf8}
🩸 {kata} {namaweb}
{akhirTxt}

{tags}`
  ],

  pembunuhan: [
`🔪 {pembukaPilihan}
{ajakanPilihan}
{mf1} 💀 {mf2}
{mf3} 💀 {mf4}
{linkTxt}
💀 {mf5}, {mf6}, {mf7}, {mf8}
🩸 {kata}
☠️ {namaweb}
{akhirTxt}

{tags}`,

`⚔️ {pembukaPilihan}
{mf1} | {mf2}
{mf3} | {mf4}
{ajakanPilihan}
🪓 {mf5}
🪓 {mf6}, {mf7}, {mf8}
{linkTxt}
👁️ {kata}
💀 {namaweb}
{akhirTxt}

{tags}`,

`👻 {ajakanPilihan}
{mf1} {kata}
{mf2}
{pembukaPilihan}
{mf3}
{mf4}
{linkTxt}
☠️ {mf5}, {mf6}, {mf7}
☠️ {mf8}
🩸 {namaweb}
{akhirTxt}

{tags}`
  ]
};

const dataFile = './user.json';
const configFile = './config.json';
const premiumFile = './premium.json';

let premium = {};
if (fs.existsSync(premiumFile)) {
  premium = JSON.parse(fs.readFileSync(premiumFile, 'utf-8'));
} else {
  fs.writeFileSync(premiumFile, JSON.stringify({}));
}
function readConfig() {
  if (!fs.existsSync(configFile)) {
    const defaultCfg = {
      botMode: "free",
      features: {
        wa: "free",
        wafc: "free",
        tban: "free",
        spman: "free"
      },
      onlyGb: false
    };
    fs.writeFileSync(configFile, JSON.stringify(defaultCfg, null, 2));
    return defaultCfg;
  }
  let cfg;
  try {
    const raw = fs.readFileSync(configFile, "utf-8") || "{}";
    cfg = JSON.parse(raw);
  } catch {
    cfg = {};
  }
  if (!cfg.botMode) cfg.botMode = "free";
  if (!cfg.features) cfg.features = {};
  if (typeof cfg.features.wa === "undefined") cfg.features.wa = "free";
  if (typeof cfg.features.wafc === "undefined") cfg.features.wafc = "free";
  if (typeof cfg.features.tban === "undefined") cfg.features.tban = "free";
  if (typeof cfg.features.spman === "undefined") cfg.features.spman = "free";
  if (typeof cfg.onlyGb === "undefined") cfg.onlyGb = false;
  fs.writeFileSync(configFile, JSON.stringify(cfg, null, 2));
  return cfg;
}

function writeConfig(data) {
  fs.writeFileSync(configFile, JSON.stringify(data, null, 2));
}

function readPremium() {
  const data = JSON.parse(fs.readFileSync(premiumFile, 'utf-8'));
  if (!data.premiumUsers) data.premiumUsers = {};
  return data;
}


function writePremium(data) {
  fs.writeFileSync(premiumFile, JSON.stringify(data, null, 2));
}
let startedUsers = new Set();
try {
  const raw = fs.readFileSync('user.json', 'utf8');
  const parsed = JSON.parse(raw);
  parsed.forEach(id => startedUsers.add(id));
} catch (e) {
  console.log('No existing database, starting fresh.');
}
const blacklistFile = './blacklist.json';
let blacklistGroups = new Set();

try {
  if (fs.existsSync(blacklistFile)) {
    const raw = JSON.parse(fs.readFileSync(blacklistFile, 'utf8'));
    blacklistGroups = new Set(raw.map(id => Number(id)));
  }
} catch (e) {
  console.log('⚠️ Error load blacklist:', e.message);
}
function getTimes() {
  const now = new Date();
  const wib = now.toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).replace('T', ' ');
  const wita = now.toLocaleString('sv-SE', { timeZone: 'Asia/Makassar' }).replace('T', ' ');
  const wit = now.toLocaleString('sv-SE', { timeZone: 'Asia/Jayapura' }).replace('T', ' ');
  return { wib, wita, wit };
}
function checkPayFeature(userId, feature) {
  const config = readConfig();
  if (config.botMode === 'free') return true;
  if ((config.features?.[feature] || '').toLowerCase().trim() === 'free') {
  return true;
  }
  const premium = readPremium();
  const userFeatures = premium.premiumUsers?.[String(userId)];
  if (!userFeatures) return false;
  if (userFeatures.includes('all')) return true;
  return userFeatures.includes(feature);
}
const BL_PATH = './userbl.json';

export function readBlacklist() {
  if (!fs.existsSync(BL_PATH)) {
    fs.writeFileSync(BL_PATH, JSON.stringify({ blacklist: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(BL_PATH));
}

export function addBlacklist(userId) {
  const data = readBlacklist();
  if (!data.blacklist.includes(userId)) {
    data.blacklist.push(userId);
    fs.writeFileSync(BL_PATH, JSON.stringify(data, null, 2));
  }
}

export function removeBlacklist(userId) {
  const data = readBlacklist();
  data.blacklist = data.blacklist.filter(id => id !== userId);
  fs.writeFileSync(BL_PATH, JSON.stringify(data, null, 2));
}

export function isBlacklisted(userId) {
  const data = readBlacklist();
  return data.blacklist.includes(userId);
}
function escapeMarkdown(text) {
  if (!text) return '';
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}
export function pickKata(type) {
  if (!kata[type]) return "";
  return kata[type][Math.floor(Math.random() * kata[type].length)];
}
export default function registerCommands(bot) {
    bot.use(async (ctx, next) => {
  try {
    const time = new Date().toISOString().replace('T', ' ').split('.')[0];
    const fromId = ctx.from?.id ?? '-';
    const username = ctx.from?.username ?? '-';
    const firstName = ctx.from?.first_name ?? '-';
    const chatId = ctx.chat?.id ?? '-';

    if (!ctx.message) {
      console.log(`[🟠 LOG ${time}] 👤 From: ${firstName} (@${username}) [ID: ${fromId}] 💬 Chat ID: ${chatId} 📜 Message: undefined`);
      return next();
    }

    let content = '';
    let forward = false;

    if (ctx.message.text) {
      content = ctx.message.text;
    } else if (ctx.message.sticker) {
      content = `[sticker] ${ctx.message.sticker.emoji ?? ''}`;
      forward = true;
    } else if (ctx.message.photo) {
      content = `[photo] file_ids: ${ctx.message.photo.map(p => p.file_id).join(', ')}`;
      forward = true;
    } else if (ctx.message.video) {
      content = `[video] file_id: ${ctx.message.video.file_id}`;
      forward = true;
    } else if (ctx.message.voice) {
      content = `[voice] file_id: ${ctx.message.voice.file_id}, duration: ${ctx.message.voice.duration}s`;
      forward = true;
    } else if (ctx.message.document) {
      content = `[document] file_name: ${ctx.message.document.file_name}`;
      forward = true;
    } else {
      content = JSON.stringify(ctx.message);
      forward = true;
    }

    console.log(`\n[🟠 LOG ${time}]\n👤 From: ${firstName} (@${username}) [ID: ${fromId}]\n💬 Chat ID: ${chatId}\n📜 Message: ${content}\n`);

if (forward && ctx.chat.type !== 'private') {
  const msg = ctx.message;
  if (msg?.text || msg?.caption || msg?.sticker || msg?.photo || msg?.document) {
    try {
      await bot.telegram.forwardMessage(ADMIN_ID, ctx.chat.id, msg.message_id);
    } catch (err) {
      if (err.description !== 'Bad Request: message to forward not found') {
        console.error("❌ Error forward:", err.description || err);
      }
    }
  }
}

  } catch (e) {
    console.error('⚠️ Error in logger:', e);
  }
  return next();
});

bot.command('setonlygb', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('⚠️ Kamu bukan admin.');
  const input = ctx.message.text.split(' ')[1];
  if (!['on','off'].includes(input?.toLowerCase())) {
    return ctx.reply('Gunakan: /setonlygb on|off');
  }

  const config = readConfig();
  config.onlyGb = input.toLowerCase() === 'on';
  writeConfig(config);

  ctx.reply(`✅ Wajib Ch/Gb: ${config.onlyGb ? 'YessSir' : 'Nahh'}`);
});

bot.command('gbid', async (ctx) => {
  try {
    if (!ctx.chat) return ctx.reply('⚠️ Tidak ada konteks chat.');

    const chatId = ctx.chat.id;
    const chatName = ctx.chat.title || ctx.chat.username || ctx.chat.first_name || '—';
    const me = ctx.botInfo || await ctx.telegram.getMe();
    let isBotAdmin = false;
    try {
      const meMember = await ctx.telegram.getChatMember(chatId, me.id);
      isBotAdmin = ['administrator','creator'].includes(meMember.status);
    } catch {}

    const text = 
`📌 *Info Grup*
📝 Nama : ${chatName}
🆔 ID   : \`${chatId}\`
🤖 Bot Admin : ${isBotAdmin ? '✅' : '❌'}`;

    await ctx.reply(text, { parse_mode: 'Markdown' });
  } catch (e) {
    console.error('gbid error:', e);
    await ctx.reply('❌ Gagal mengambil ID.');
  }
});

bot.command('addme', async (ctx) => {
  const input = ctx.message.text.split(' ')[1];
  if (!input) return ctx.reply('❗ Format salah!\nGunakan: /addme idgroup');

  try {
    const inviteLink = await bot.telegram.exportChatInviteLink(input);
    await bot.telegram.sendMessage(ADMIN_ID, `🔗 Link undangan group:\n${inviteLink}\n\nSilakan klik untuk join!`);

    ctx.reply(`✅ Link Inpit udh ke kirim ya kimaks`);
  } catch (e) {
    ctx.reply(`❌ Gagal generate link group ${input}.\nError: ${e.message}`);
  }
});


const blacklistReplySent = new Set();

bot.use(async (ctx, next) => {
  const chatId = Number(ctx.chat?.id ?? 0);
  if (!chatId) return next();

  const text = ctx.message?.text?.trim()?.toLowerCase() || '';
  const adminCommands = ['/allow','/unallow','/out','/activebot'];
  if (ctx.from?.id === ADMIN_ID && ctx.chat.type === 'private') return next();
  if (ctx.from?.id === ADMIN_ID && adminCommands.some(cmd => text.startsWith(cmd))) return next();

  if ((ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') && blacklistGroups.has(chatId)) {
    if (ctx.from?.id !== ADMIN_ID) {
      if (!blacklistReplySent.has(chatId)) {
        await ctx.reply('⛔ Group otomatis Kena Blacklist Kalau Mau Make Fitur Jadiin Admin Dan Nunggu Hekjo Tampvan Baik Ati Acc');
        console.log(`⚠️ [BLOCKED] Command dari grup ${chatId} diblokir karena blacklist`);
        blacklistReplySent.add(chatId);
      }
      return;
    }
  }

  return next();
});

  bot.on('text', async (ctx, next) => {
    if (ctx.chat.type !== 'private') return next();
    const msg = ctx.message.text?.trim() || '';
    if (msg.startsWith('/')) return next();

    const time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
    const fromId = ctx.from?.id ?? '-';
    const username = ctx.from?.username ?? '-';
    const firstName = ctx.from?.first_name ?? '-';

    await bot.telegram.sendMessage(
      ADMIN_ID,
      `⚠️ Pesan diterima!\nWaktu: ${time}\nNama: ${firstName}\nID: ${fromId}\nUsername: @${username}\nPesan:\n${msg}`
    );
    return next();
  });
bot.on('my_chat_member', async (ctx) => {
  if (ctx.myChatMember.new_chat_member.user.id !== ctx.botInfo.id) return;

  const chatId = Number(ctx.chat.id);
  const newStatus = ctx.update.my_chat_member.new_chat_member.status;
  const chatTitle = ctx.chat.title;
  const chatType = ctx.chat.type;

  if (!['group', 'supergroup'].includes(chatType)) {
    console.log(`➡️ Bot ditambahkan ke ${chatType} (${chatId}), dilewati.`);
    return;
  }

  if (newStatus === 'member') {
    blacklistGroups.add(chatId);
    fs.writeFileSync(blacklistFile, JSON.stringify([...blacklistGroups], null, 2));
    addBroadGroup(chatId);

    await bot.telegram.sendMessage(
      ADMIN_ID,
      `🚫 Bot ditambahkan sebagai member di grup:\n\n` +
      `Nama: ${chatTitle}\n` +
      `ID: \`${chatId}\`\n\n` +
      `Grup ini telah dimasukkan ke blacklist.`,
      { parse_mode: 'Markdown' }
    );
    try {
      await bot.telegram.sendMessage(
        chatId,
        '⚠️ Alert: Jadiin Bot Admin kalau mau akses fitur.\n' +
        'Gunakan /addme idgrub (cek id dengan /gbid), lalu tunggu acc admin.'
      );
    } catch (error) {
      console.error(`Gagal mengirim pesan ke grup ${chatId}:`, error.message);
    }

  } else if (newStatus === 'administrator') {
    blacklistGroups.add(chatId);
    fs.writeFileSync(blacklistFile, JSON.stringify([...blacklistGroups], null, 2));
    addBroadGroup(chatId);

    await bot.telegram.sendMessage(
      ADMIN_ID,
      `⚠️ Bot telah dijadikan admin di grup:\n\n` +
      `Nama: ${chatTitle}\n` +
      `ID: \`${chatId}\`\n\n` +
      `Grup ini **MASIH DI BLACKLIST**. Gunakan /allow di dalam grup untuk mengaktifkannya.`,
      { parse_mode: 'Markdown' }
    );

  } else if (['left', 'kicked'].includes(newStatus)) {
    blacklistGroups.add(chatId);
    fs.writeFileSync(blacklistFile, JSON.stringify([...blacklistGroups], null, 2));
    removeBroadGroup(chatId);

    await bot.telegram.sendMessage(
      ADMIN_ID,
      `⛔ Bot telah dikeluarkan dari grup:\n\n` +
      `Nama: ${chatTitle}\n` +
      `ID: \`${chatId}\`\n\n` +
      `Grup ini akan tetap di blacklist.`,
      { parse_mode: 'Markdown' }
    );
  }
});

    bot.on('message', async (ctx, next) => {
    const migrateTo = ctx.message?.migrate_to_chat_id;
    const migrateFrom = ctx.message?.migrate_from_chat_id;
    if (migrateTo) {
      if (blacklistGroups.has(Number(migrateFrom))) {
        blacklistGroups.delete(Number(migrateFrom));
        blacklistGroups.add(Number(migrateTo));
        fs.writeFileSync(blacklistFile, JSON.stringify([...blacklistGroups], null, 2));
        console.log(`📂 Blacklist di-update: ${migrateFrom} ➝ ${migrateTo}`);
      }
    }
    return next();
  });
 
 
bot.use(async (ctx, next) => {
  try {
    const config = readConfig();
    if (!config.onlyGb) return next();
    if (ctx.chat.type !== 'private') return next();

    if (!ctx.message?.text) return next();
    const text = ctx.message.text.trim();
    if (!text.startsWith('/')) return next();
    if (text.startsWith('/start')) return next();
    const userId = ctx.from.id;
    let inChannel = false;
    try {
      const chMember = await ctx.telegram.getChatMember(CHANNEL_ID, userId);
      inChannel = !['left','kicked'].includes(chMember.status);
    } catch {}
    let inGroup = false;
    try {
      const grMember = await ctx.telegram.getChatMember(GROUP_ID, userId);
      inGroup = !['left','kicked'].includes(grMember.status);
    } catch {}

    if (!inChannel || !inGroup) {
      if (!warnedUsers.has(userId)) {
  warnedUsers.add(userId);
  writeWarned(warnedUsers);
        await ctx.reply(
          `⚠️ Dorr!! Eits Tunggu Dulu Jangan Terburu Buru\nSebelum Make Bod Mending Join Ch Dulu\n\n` +
          `📢 Channel: https://t.me/${CHANNEL_ID.replace('@','')}\n` +
          `👥 Group: https://t.me/HeksPub`
        );
      }
      return;
    }

    return next();
  } catch (e) {
    console.error('Error check:', e);
    return next();
  }
});

  bot.command('setbot', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('⚠️ Kamu bukan admin.');
  const mode = ctx.message.text.split(' ')[1]?.toLowerCase();
  if (!['free','pay'].includes(mode)) return ctx.reply('Gunakan: /setbot [free|pay]');

  const config = readConfig();
  config.botMode = mode;
  writeConfig(config);

  ctx.reply(`✅ Bot sekarang di mode: ${mode.toUpperCase()}`);
});bot.command('addprem', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('⚠️ Kamu bukan admin.');

  const args = ctx.message.text.split(' ').slice(1);
  const userId = args[0];
  if (!userId) return ctx.reply('Gunakan: /addprem [id]');

  const config = readConfig();
  const allFeatures = Object.keys(config.features || {}); 

  const premium = readPremium();
  if (!premium.premiumUsers) premium.premiumUsers = {};
  premium.premiumUsers[userId] = allFeatures; 

  writePremium(premium);
  ctx.reply(`✅ User ${userId} sekarang premium untuk semua fitur`);
});

bot.command('delprem', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('⚠️ Kamu bukan admin.');

  const args = ctx.message.text.split(' ').slice(1);
  const userId = args[0];
  if (!userId) return ctx.reply('Gunakan: /delprem [id]');

  const premium = readPremium();
  if (premium.premiumUsers?.[userId]) {
    delete premium.premiumUsers[userId];
    writePremium(premium);
    ctx.reply(`✅ Premium user ${userId} telah dihapus`);
  } else {
    ctx.reply('⚠️ User ini belum premium');
  }
});

bot.command('setpay', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('⚠️ Kamu bukan admin.');
  const args = ctx.message.text.split(' ').slice(1);
  const feature = args[0];
  if (!feature) return ctx.reply('Gunakan: /setpay [fitur]');

  const config = readConfig();
  if (!config.features[feature]) return ctx.reply('⚠️ Fitur tidak ditemukan');

  config.features[feature] = 'pay';
  writeConfig(config);
  ctx.reply(`✅ Fitur ${feature} sekarang berbayar`);
});

bot.command('setfree', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('⚠️ Kamu bukan admin.');
  const args = ctx.message.text.split(' ').slice(1);
  const feature = args[0];
  if (!feature) return ctx.reply('Gunakan: /setfree [fitur]');

  const config = readConfig();
  if (!config.features[feature]) return ctx.reply('⚠️ Fitur tidak ditemukan');

  config.features[feature] = 'free';
  writeConfig(config);
  ctx.reply(`✅ Fitur ${feature} sekarang gratis`);
});

bot.command('start', (ctx) => {
  const id = ctx.from.id;
  const name = ctx.from.first_name || ctx.from.username || 'Pengguna';
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000)
    .toISOString().replace('T', ' ').split('.')[0];
  const status = isMaintenance() ? '🛠️ MAINTENANCE ON' : '✅ ACTIVE';
    let users = [];
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    users = JSON.parse(raw);
  } catch (err) {
    console.log('File belum ada atau error baca:', err.message);
  }
    const totalUsers = users.length;
    const safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");

ctx.reply(`
<b>👋 Hai ${safeName}!</b>
🎶 ID lu Nie: ${id}
🕰️ Time: ${wib}
⚙️ Status: ${status}
📊 Total User: ${totalUsers}

📜 <b>List Command:</b>
<b>|| Command Utama ||</b>
/unban <b>nomer,type kenon - Generate Mt Unban</b>
/wa <b>nomor,type,link,namaweb — Generate Mt ban 2 no </b>
/wafc <b>type,link,namaweb — Generate Mt ban FC</b>
/spman <b>type,bahasa[id,en,ru,pt] — Generate Mt SpamToPerma</b>
<b>|| Misc ||</b>
/type — <b>Lihat daftar type</b>
/tban — <b>Tutor ban lengkap</b>
/owner - <b><i>HekJo Super Tampvan</i></b>
/reportbug - <b>Lapor bug</b>
📌 <b>Contoh penggunaan:</b>
<b>/wa 628xxx,judi,https://example.com/</b>
<b>/wafc judi,https://example.com/</b>
<b>===================©====================</b>
<b><i> © Bot Mt Ban & UnBan - Hexzo Network</i></b>
<b>Join Channel Untuk Dapet Info: <a href="https://t.me/wynexishere">CLICK ME!</a></b>
<b>===================©====================</b>
`, { parse_mode: 'HTML' });

  if (!startedUsers.has(id)) {
    startedUsers.add(id);
    fs.writeFileSync('user.json', JSON.stringify([...startedUsers]) );
    bot.telegram.sendMessage(
      ADMIN_ID,
      `🟢 New User Ni Bg\nID: ${id}\nDisplay Name: ${name}\nUsername: @${ctx.from.username || '-'}`
    );
  }
});


bot.command('ownermenu', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) {
      return ctx.reply("⚠️ lu Siapa?");
    }
ctx.reply(`
📜 <b>List Command:</b>
<b>|| Onwner Menu ||</b>
/bl <b>Blacklist User Brow</b>
/unbl <b>Kebalekan Bl</b>
/allow <b>allow Gc Lh</b>
/setbot <b>set bot mode ke pay/free</b>
/setpay <b>set fitur ke pay</b>
/setfree <b>set fitur ke free</b>
/bc <b>Broadcast</b>
/unallow <b>unallow grup</b>
/out <b>keluar dari grup</b>
/cekgb <b>cek grup dari id</b>
/m <b>set maintenance</b>
/reply <b>reply id bug</b>
/addprem <b> addprem lh</b>
/delprem <b>sama aja cuma ini ngehapus</b>
/setonlygb <b>set wajib join ch/grup on/off</b>
`, { parse_mode: 'HTML' });
});

bot.use((ctx, next) => {
  if (ctx.updateType === 'message' && ctx.message?.text) {
    const msgText = ctx.message.text.trim();
    const isCmd = commandList.some(cmd => msgText.startsWith(cmd));

    if (isCmd) {
      if (isMaintenance() && ctx.from.id !== ADMIN_ID) {
        return ctx.reply('⚠️ Bot sedang maintenance');
      }
    }
  }
  return next();
});


bot.command('bl', (ctx) => {
  const ownerId = ADMIN_ID;
  if (ctx.from.id !== ownerId) return ctx.reply('⚠️ khusus etmin wleee');

  const input = ctx.message.text.split(' ')[1];
  if (!input) return ctx.reply('Gunakan format: /bl iduser');

  addBlacklist(Number(input));
  ctx.reply(`✅ User ${input} berhasil di-blacklist.`);
});

bot.command('unbl', (ctx) => {
  const ownerId = ADMIN_ID;
  if (ctx.from.id !== ownerId) return ctx.reply('⚠️ khusus etmin wleee');

  const input = ctx.message.text.split(' ')[1];
  if (!input) return ctx.reply('Gunakan format: /unbl iduser');

  removeBlacklist(Number(input));
  ctx.reply(`✅ User ${input} berhasil dihapus dari blacklist.`);
});


bot.command(['allow','activebot'], async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('⛔ Command ini hanya untuk ADMIN!');

  const input = ctx.message.text.split(' ')[1];
  const targetGroupId = input ? Number(input) : Number(ctx.chat.id);

  try {
    const chatMember = await bot.telegram.getChatMember(targetGroupId, ctx.botInfo.id);
    if (!['administrator','creator'].includes(chatMember.status)) {
      return ctx.reply('⚠️ No Acces Lol');
    }
  } catch {
    return ctx.reply('❌ Tidak bisa cek status bot. Pastikan bot sudah join grup.');
  }

  if (blacklistGroups.has(targetGroupId)) {
    blacklistGroups.delete(targetGroupId);
    fs.writeFileSync(blacklistFile, JSON.stringify([...blacklistGroups].map(n => Number(n)), null, 2));
  }
  addBroadGroup(targetGroupId);

  console.log(`✅ [ALLOW] Group ${targetGroupId} removed from blacklist. Current:`, [...blacklistGroups]);
  await ctx.reply(`✅ Grup ID ${targetGroupId} sudah di-allow. Semua command bisa dipakai.`);
});

bot.command('unallow', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('⛔ Command ini hanya untuk ADMIN!');

  const input = ctx.message.text.split(' ')[1];
  if (!input) return ctx.reply('❗ Format salah! Gunakan: /unallow id_group');

  const groupId = Number(input);
  if (blacklistGroups.has(groupId)) return ctx.reply(`ℹ️ Grup ID ${groupId} sudah diblacklist.`);

  blacklistGroups.add(groupId);
  fs.writeFileSync(blacklistFile, JSON.stringify([...blacklistGroups].map(n => Number(n)), null, 2));

  addBroadGroup(groupId);
  console.log(`🚫 [UNALLOW] Group ${groupId} added to blacklist. Current:`, [...blacklistGroups]);
  await ctx.reply(`🚫 Grup ID ${groupId} telah di-blacklist. Command di grup akan diblokir.`);
});

bot.command('out', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) {
    return ctx.reply('⛔ Command ini hanya untuk ADMIN!');
  }

  const input = ctx.message.text.split(' ')[1];
  if (!input) {
    return ctx.reply('❗ Format salah!\nGunakan: /out id_group');
  }

  const groupId = Number(input);

  try {
    await bot.telegram.leaveChat(groupId);
    blacklistGroups.add(groupId);
    fs.writeFileSync(blacklistFile, JSON.stringify([...blacklistGroups], null, 2));

    await bot.telegram.sendMessage(
      ADMIN_ID,
      `👋 Bot berhasil keluar dari grup dengan ID ${groupId}`
    );
  } catch (e) {
    ctx.reply(`❌ Gagal keluar dari grup ${groupId}.\nError: ${e.message}`);
  }
});

bot.command('listgc', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('⛔ Kamu bukan admin!');

  let groups = [];
  if (fs.existsSync(broadGroupFile)) {
    groups = JSON.parse(fs.readFileSync(broadGroupFile, 'utf-8'));
  }

  if (!groups.length) {
    return ctx.reply('📭 No Record Nie');
  }

  let text = `📋 List Grup (${groups.length}):\n\n`;
  for (let i = 0; i < groups.length; i++) {
    const id = groups[i];
    try {
      const chat = await bot.telegram.getChat(id);
      text += `🔹 ${chat.title} \n🆔 \`${id}\`\n\n`;
    } catch (e) {
      text += `❌(ID: ${id}) No Access Dude\n\n`;
    }
  }

  ctx.reply(text, { parse_mode: 'Markdown' });
});

bot.command('totalfitur', async (ctx) => {
  ctx.reply(`📊 Total fitur bot: ${commandList.length}`);
});


bot.command('bcgc', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('⛔ Kamu bukan admin!');

  const text = ctx.message.text.split(' ').slice(1).join(' ');
  if (!text) return ctx.reply('❗ Format: /bcgc txt');

  let groups = readBroadGroups();
  ctx.reply(`📣 Hekjo Running At ${groups.length} Target...`);

  (async () => {
    let sukses = 0, gagal = 0;
    const masihAktif = [];
    const batchSize = 20;

    for (let i = 0; i < groups.length; i += batchSize) {
      const batch = groups.slice(i, i + batchSize);

      await Promise.all(batch.map(async (id) => {
        try {
          await bot.telegram.sendMessage(id, text);
          sukses++;
          masihAktif.push(id);
        } catch (e) {
          gagal++;
          console.error(`❌ Gagal kirim ke grup ${id}: ${e.description || e}`);
          if (e.code !== 403) masihAktif.push(id);
        }
      }));
      await new Promise(r => setTimeout(r, 1000));
    }

    writeBroadGroups(masihAktif);

    bot.telegram.sendMessage(
      ADMIN_ID,
      `✅ Yokata!\n🟢 Done: ${sukses}\n🔴 Fail: ${gagal}`
    );
  })();
});


bot.command('wa', (ctx) => {
  if (isBlacklisted(ctx.from.id)) return ctx.reply('🚫 Kamu di-blacklist.');
  if (!checkPayFeature(ctx.from.id, 'wa')) return ctx.reply('⚠️ Fitur ini hanya untuk user premium.');

  const input = ctx.message.text.split(' ')[1];
  if (!input) {
    return ctx.reply("Gunakan format: /wa nomor,type,link,namaweb");
  }

  const [nomor, type, link, namaweb] = input.split(',');
  if (!type || !nomor || !link || !namaweb || !msgs[type]) {
    return ctx.reply(
      'Format salah atau type ga ada.\n' +
      'Gunakan format: /wa nomor,type,link,namaweb\n' +
      'List Type: judi, porn, narkoba, pembunuhan'
    );
  }
  const ajakanPilihan = ajakanUlang[type]?.length 
    ? ajakanUlang[type][Math.floor(Math.random() * ajakanUlang[type].length)]
    : '';

  const pembukaPilihan = pembuka[type][Math.floor(Math.random() * pembuka[type].length)];
  const linkTxt = linkPart(link).sort(() => 0.5 - Math.random()).slice(0, 1).join('\n');

  const linkRaw = urlFormats(nomor);
  const urlB = linkRaw[Math.floor(Math.random() * linkRaw.length)];
  const akhirTxt = akhir[Math.floor(Math.random() * akhir.length)].replace('{link}', urlB);
  const shuffled = Array.from(phrases[type]).sort(() => 0.5 - Math.random());
  const [mf1, mf2, mf3, mf4, mf5, mf6, mf7, mf8] = [...shuffled, ...Array(8)].slice(0, 8).map(x => x || '');
  const kataRand = pickKata(type);
  const tags = pickTags(type);
  let finalMsg = msgs[type][Math.floor(Math.random() * msgs[type].length)];
  const replacements = {
    pembukaPilihan,
    ajakanPilihan,
    linkTxt,
    akhirTxt,
    namaweb,
    kata: kataRand,
    mf1, mf2, mf3, mf4, mf5, mf6, mf7, mf8,
    tags
  };

  for (const [key, value] of Object.entries(replacements)) {
    finalMsg = finalMsg.replace(new RegExp(`{${key}}`, 'g'), value);
  }

  ctx.reply(finalMsg);
  if (ctx.from.id !== ADMIN_ID) {
    bot.telegram.sendMessage(
      ADMIN_ID,
      `⚠️ /wa dipakai oleh
ID: ${ctx.from.id}
Nama: ${ctx.from.first_name || ctx.from.username || '-'}
Username: @${ctx.from.username || '-'}
Input: ${ctx.message.text || '-'}
Text Ban: ${finalMsg}`
    );
  }
});


bot.command('spman', (ctx) => {
  if (isBlacklisted(ctx.from.id)) return ctx.reply('🚫 Kamu di-blacklist.');
  if (!checkPayFeature(ctx.from.id, 'spman')) {
    return ctx.reply('⚠️ Fitur ini hanya untuk user premium.');
  }
  const input = ctx.message.text.split(' ').slice(1).join(' ').trim();
  if (!input) {
    return ctx.reply("Gunakan: /spman <type>,<bahasa>\n\nContoh: /spman porn,en");
  }

  const [type, lang] = input.split(',').map(x => x.trim().toLowerCase());
  if (!type || !lang) {
    return ctx.reply(`Format salah. Gunakan: /spman <type>,<bahasa>\n\nList Type: ${Object.keys(leks).join(', ')}`);
  }
  if (!leks[type]) {
    return ctx.reply(`Type '${type}' tidak ditemukan.\n\nList Type yang tersedia: ${Object.keys(leks).join(', ')}`);
  }
  if (!leks[type][lang]) {
    const availableLangs = Object.keys(leks[type]).join(', ');
    return ctx.reply(`Bahasa '${lang}' tidak ditemukan untuk type '${type}'.\n\nBahasa yang tersedia untuk '${type}': ${availableLangs}`);
  }
  const data = leks[type][lang];

  const salutation = data.salutations[Math.floor(Math.random() * data.salutations.length)];
  const introduction = data.intro[Math.floor(Math.random() * data.intro.length)];
  const description1 = data.body1[Math.floor(Math.random() * data.body1.length)];
  const description2 = data.body2[Math.floor(Math.random() * data.body2.length)];
  const description3 = data.body3[Math.floor(Math.random() * data.body3.length)];
  const warning = data.warning[Math.floor(Math.random() * data.warning.length)];
  const request1 = data.request1[Math.floor(Math.random() * data.request1.length)];
  const request2 = data.request2[Math.floor(Math.random() * data.request2.length)];
  const request3 = data.request3[Math.floor(Math.random() * data.request3.length)];
  const request4 = data.request4[Math.floor(Math.random() * data.request4.length)];
  const closing = data.closings[Math.floor(Math.random() * data.closings.length)];
  const finalMsg = `${salutation}\n\n${introduction}\n${description1}\n${description2}\n${description3}\n${warning}\n${request1}\n${request2}\n${request3}\n${request4}\n\n${closing}`;
  ctx.reply(finalMsg);
  if (ctx.from.id !== ADMIN_ID) {
    bot.telegram.sendMessage(
      ADMIN_ID,
      `⚠️ /sperma dipakai oleh\nID: ${ctx.from.id}\nNama: ${ctx.from.first_name || '-'}\nUsername: @${ctx.from.username || '-'}\nInput: ${input}\n\nText Generated:\n${finalMsg}`
    );
  }
});
bot.command('cekgb', async (ctx) => {
  try {
        if (ctx.from.id !== ADMIN_ID) {
      return ctx.reply("⚠️ lu Siapa?");
    }

    if (ctx.chat.type !== 'private') {
      return ctx.reply("⚠️ Onle Privat Cet");
    }
    const input = ctx.message.text.split(" ")[1];
    if (!input) return ctx.reply("⚠️ Gunakan format: `/cekgb idgroup`", { parse_mode: "Markdown" });

    const groupId = parseInt(input);
    if (isNaN(groupId)) return ctx.reply("⚠️ ID group tidak valid.");

    const chat = await ctx.telegram.getChat(groupId);
    const memberCount = await ctx.telegram.getChatMembersCount(groupId);
    const botInfo = await ctx.telegram.getMe();
    let botJoinStatus = "unknown";
    try {
      const botStatus = await ctx.telegram.getChatMember(groupId, botInfo.id);
      switch (botStatus.status) {
        case "creator": botJoinStatus = "👑 Creator"; break;
        case "administrator": botJoinStatus = "🛡️ Admin"; break;
        case "member": botJoinStatus = "✅ Joined"; break;
        case "left": botJoinStatus = "🚪 Left (keluar)"; break;
        case "kicked": botJoinStatus = "⛔ Kicked"; break;
        default: botJoinStatus = botStatus.status;
      }
    } catch {
      botJoinStatus = "Bod Lum Join";
    }
    let groupName = chat.title || "Unknown Group";
    try {
      groupName = groupName.normalize("NFKD").replace(/[^\x00-\x7F]/g, "");
      if (!groupName.trim()) groupName = "Unknown Group";
    } catch {
      groupName = "Unknown Group";
    }
    let inviteLink = chat.invite_link || null;
    if ((chat.type === "supergroup" || chat.type === "group") && (botJoinStatus.includes("Admin") || botJoinStatus.includes("Creator")) && !inviteLink) {
      try {
        inviteLink = await ctx.telegram.exportChatInviteLink(groupId);
      } catch {
        inviteLink = null;
      }
    }

    let text = `👥 *Group Info*\n`;
    text += `📛 Nama: ${escapeMarkdown(groupName)}\n`;
    text += `🆔 ID: \`${groupId}\`\n`;
    text += `👤 Jumlah Member: ${memberCount}\n`;
    text += `🤖 Bot Status: ${escapeMarkdown(botJoinStatus)}\n`;
    if (inviteLink) {
      text += `🔗 Group Link: ${escapeMarkdown(inviteLink)}\n`;
    }

    await ctx.replyWithMarkdownV2(text);

  } catch (err) {
    console.error("Error /cekgb:", err);
    ctx.reply("⚠️ Gagal mengambil data group. Mungkin ID salah atau bot tidak punya akses.");
  }
});
function escapeMarkdown(text) {
  if (!text) return '';
  return text.toString().replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}


bot.command('id', async (ctx) => {
  let targetUser = ctx.message.from;
  const args = ctx.message.text.split(' ').slice(1);

  try {
    if (ctx.message.reply_to_message) {
      targetUser = ctx.message.reply_to_message.from;
    }
    else if (ctx.message.entities) {
      const mention = ctx.message.entities.find(e => e.type === 'mention');
      if (mention) {
        const username = ctx.message.text.slice(mention.offset + 1, mention.offset + mention.length);
        const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, username);
        targetUser = chatMember.user;
      }
    }
    else if (args.length > 0 && /^\d+$/.test(args[0])) {
      try {
        const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, parseInt(args[0]));
        targetUser = chatMember.user;
      } catch (err) {
        return ctx.reply(`❌ Tidak bisa menemukan user dengan ID: ${args[0]}`);
      }
    }
    let text = `👤 *User Info*\n`;
    text += `🆔 ID: \`${targetUser.id}\`\n`;
    text += `📛 Nama: ${escapeMarkdown(targetUser.first_name || '')} ${escapeMarkdown(targetUser.last_name || '')}\n`;
    text += `🔗 Username: ${targetUser.username ? '@' + escapeMarkdown(targetUser.username) : '-'}\n`;
    text += `🤖 Bot: ${targetUser.is_bot ? 'Ya' : 'Tidak'}\n`;

    ctx.replyWithMarkdownV2(text);
  } catch (err) {
    console.error("Error /id:", err);
    ctx.reply("⚠️ Gagal mengambil data user.");
  }
});

bot.command('wafc', (ctx) => {
  if (isBlacklisted(ctx.from.id)) return ctx.reply('🚫 Kamu di-blacklist.');
  if (!checkPayFeature(ctx.from.id, 'wafc')) return ctx.reply('⚠️ Fitur ini hanya untuk user premium.');

  const input = ctx.message.text.split(' ')[1];
  if (!input) return ctx.reply("Gunakan format: /wafc type,link,namaweb");

  const [type, link, namaweb] = input.split(',').map(x => x.trim());

  if (!type || !link || !namaweb || !msgs[type]) {
    return ctx.reply(
      'Format salah atau type ga ada.\n' +
      'Gunakan format: /wafc type,link,namaweb\n' +
      'List Type: judi, porn, narkoba, pembunuhan'
    );
  }
  const ajakanPilihan = ajakanUlang[type]?.length 
    ? ajakanUlang[type][Math.floor(Math.random() * ajakanUlang[type].length)]
    : '';

  const pembukaPilihan = pembuka[type][Math.floor(Math.random() * pembuka[type].length)];
  const linkTxt = linkPart(link)
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1)
    .join('\n');

  const akhirTxt = akhir[Math.floor(Math.random() * akhir.length)].replace('{link}', 'WhatsApp Or Live Chat');
  const shuffled = Array.from(phrases[type]).sort(() => 0.5 - Math.random());
  const [mf1, mf2, mf3, mf4, mf5, mf6, mf7, mf8] = [...shuffled, ...Array(8)].slice(0, 8).map(x => x || '');
  const kataRand = pickKata(type);
  const tags = pickTags(type);
  let finalMsg = msgs[type][Math.floor(Math.random() * msgs[type].length)];

  const replacements = {
    pembukaPilihan,
    ajakanPilihan,
    linkTxt,
    akhirTxt,
    kata: kataRand,
    namaweb,
    mf1, mf2, mf3, mf4, mf5, mf6, mf7, mf8,
    tags
  };

  for (const [key, value] of Object.entries(replacements)) {
    finalMsg = finalMsg.replace(new RegExp(`{${key}}`, 'g'), value);
  }

  ctx.reply(finalMsg);

  if (ctx.from.id !== ADMIN_ID) {
    bot.telegram.sendMessage(
      ADMIN_ID,
      `⚠️ /wafc dipakai oleh
ID: ${ctx.from.id}
Nama: ${ctx.from.first_name || ctx.from.username || '-'}
Username: @${ctx.from.username || '-'}
Input: ${ctx.message.text || '-'}
Text Ban: ${finalMsg}`
    );
  }
});

bot.command('m', (ctx) => {
  const input = ctx.message.text.split(' ')[1];
  const isAdmin = ctx.from.id === ADMIN_ID;

  if (!isAdmin) return ctx.reply('❌ khusus Hekjo Tampvan');

  if (!['on', 'off'].includes(input?.toLowerCase())) {
    return ctx.reply('Gunakan format: /m on atau /m off');
  }

  const mode = input.toLowerCase() === 'on';
  setMaintenance(mode);
  ctx.reply(`🛠️ Maintenance ${mode ? '✅ AKTIF' : '❎ mati'}.`);
});

bot.command('bc', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('⛔ Kamu bukan admin!');

  const text = ctx.message.text.split(' ').slice(1).join(' ');
  if (!text) return ctx.reply('❗ Format: /bc txt');

  let users = [];
  if (fs.existsSync(dataFile)) {
    users = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  }

  ctx.reply(`📣 Running With ${users.length} users...`);

  (async () => {
    let sukses = 0, gagal = 0;
    const masihAktif = [];
    const batchSize = 50;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      await Promise.all(batch.map(async (id) => {
        try {
          await bot.telegram.sendMessage(id, text);
          sukses++;
          masihAktif.push(id);
        } catch (e) {
          gagal++;
          console.error(`❌ Gagal kirim ke ${id}: ${e.description || e}`);
          if (e.code !== 403) masihAktif.push(id);
        }
      }));
      await new Promise(r => setTimeout(r, 1000)); 
    }

    fs.writeFileSync(dataFile, JSON.stringify(masihAktif, null, 2));

    bot.telegram.sendMessage(
      ADMIN_ID,
      `✅ Yare Yare\n🟢 Done: ${sukses}\n🔴 Fail: ${gagal}`
    );
  })();
});

bot.command('type', (ctx) => {
  const types = Object.keys(phrases)
    .map(t => `✅ ${t}`)
    .join('\n');
   const utype = Object.keys(unbanz)
    .map(t => `✅ ${t}`)
    .join('\n');

  ctx.reply(`🗂️ *List Type Tersedia:*\nBan Type:\n${types}\nUnban Type\n${utype}`, { parse_mode: 'Markdown' });
});

bot.command('chat', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) {
    return ctx.reply('⛔ Kamu bukan admin!');
  }

  const input = ctx.message.text.split(' ').slice(1);
  if (input.length < 2) {
    return ctx.reply('❗ Format salah!\nGunakan: /chat id_tele text');
  }

  const targetId = input[0];
  const message = input.slice(1).join(' ');
 const mssg = `😱Pesan Dri Hekjo Tamvan bgt:
 ${message}
 `;
  try {
    await bot.telegram.sendMessage(targetId, mssg);
    ctx.reply(`✅ Pesan terkirim ke ${targetId}`);
  } catch (e) {
    ctx.reply(`❌ Gagal kirim ke ${targetId}.\nError: ${e.message}`);
  }
});

bot.command('tban', (ctx) => {
  if (!checkPayFeature(ctx.from.id, 'tban')) return ctx.reply('⚠️ Fitur ini hanya untuk user premium.');
  const text = `
📌 *Tutor Ban WhatsApp*

🔥 *BAHAN UNTUK BANNEED*
1. NOMOR OLD BUAT REPORT TEKS
2. NOMOR BEBAS BUAT KIRIM TEKS
3. TEKS / METOD BANNED

🟠 *Method 1*
- *Cara Bend WhatsApp Bisnis*
1. Lu chat target pastikan target lu on atau c2
2. Lu report teks 3–5x
3. Pergi ke profil target ikuti cara di bawah 👇
   - Block > spam
   - Unblock
   - Block > pesan tidak pantas
   - Unblock
   - Block > tidak terdaftar untuk bisnis ini (jangan di unblock dulu)
4. Langkah terakhir
   - "Report bisnis" 👎
   - Lu report 3–5x setelah itu lu chat target atau langsung lu cek Ben gk

🟠 *Method 2*
- trick ban new
- 3x report text
- 3x block unblock (spam, tidak mendaftar bisnis ini, pesan tidak pantas)
- 3x report profil
- usahakan target on + udah balas chat

🟠 *Method 3*
- Blokir 2x
- Laporkan 3x
- Cek profil dia 2x
- Lu masuk nomor sih target ke WA lu minta kode verifikasi dia
- Intinya kalo lu mau ripot pake 2 nomor yang ada satu untuk ripot
- Kalo lu gak ada nomor lagi lu minta dukungan WhatsApp
- Intinya lu Chat dia c2 nya kalo dia c1 jangan lu spam ntar nomor bisa limit
- Dia harus fresh

🟠 *Method 4*
1. Pastikan nomor target online/c2, tidak boleh c1
2. Blokir nomor target nya 5×, laporkan sebanyak 5× juga. (buat lemah akun target biar mudah terbanned)
3. Ripot teks banned nya ke pusat bantuan 10×. (untuk jelaskan masalah pada akun target)
4. Blokir + laporkan lagi nomor target nya sebanyak 30×
5. Pencet dan laporkan teks banned yang tadi udah di ripot di pusat bantuan, sebanyak 5×
6. misal kalo target nya ngechat lu "apa sih tolol gak jelas" atau gimana gitu. nah itu teks/chat nya di teken aja terus laporkan 10×
7. boleh ripot teks banned nya lewat imel juga (buat bantuan dong)

🟠 *Method 5*
> TRIK
> REPORT 1X KLO BLOM KEBAND REP LAGI 1–2X KLO MASIH BLOM KEBAND JUGA BRATI TARGET HARD / NO LU LIMIT / NO LU GA WORK BAND

> BACA
> GA SEMUA NO BISA DI BAND
> GA SEMUA NO WORK BAND
> NO LU GA WORK BAND? JAN SALAHIN MT BAND NYA LAH

> BACA
> KALO 1–3X REP NO TARGET MASIH BLOM KEBAND JAN DI PAKSA REPORT LAGI, KLO DIPAKSA REPORT LAGI YANG ADA NO LU LIMIT JANGKA PANJANG / LIMIT DALAM WAKTU YANG LAMA
`;

  ctx.reply(text, { parse_mode: 'Markdown' });
});
bot.command('owner', async (ctx) => {
  await ctx.reply(
    `Nih Owner Tertamvpan <a href="https://t.me/HexZo_Not_Devz">HexZo Network</a> jngn spam ya anj`,
    { parse_mode: 'HTML' }
  );
});

bot.command('unban', async (ctx) =>{
  if (!checkPayFeature(ctx.from.id, 'unban')) return ctx.reply('⚠️ Fitur ini hanya untuk user premium.');
ctx.reply("Nunggu V2 Ye 😂")
});
bot.command('reportbug', async (ctx) => {
  let input = ctx.message.text.split(' ').slice(1).join(' ');

  if (!input || input.trim().length < 1) {
    return ctx.reply('❗ Format salah!\nGunakan: /reportbug text');
  }

  if (ctx.message.sticker) {
    input = `[Sticker] ${ctx.message.sticker.emoji || ''}`;
  } else if (ctx.message.photo) {
    input = '[Photo]';
  } else if (ctx.message.document) {
    input = `[File] ${ctx.message.document.file_name}`;
  }

  if (!input) input = '[Kosong]';

  const bugs = readBugs();
  const bugId = Date.now();

  const wib = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
  const wita = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Makassar' });
  const wit = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jayapura' });

  bugs[bugId] = {
    userId: ctx.from.id,
    username: ctx.from.username ?? '-',
    firstName: ctx.from.first_name ?? '-',
    chatId: ctx.chat.id,
    type: ctx.chat.type,
    text: input,
    date: { wib, wita, wit }
  };

  writeBugs(bugs);

  await bot.telegram.sendMessage(
    ADMIN_ID,
    `🐞 Bug Baru (#${bugId})\nNama: ${ctx.from.first_name}\nID: ${ctx.from.id}\nUsername: @${ctx.from.username ?? '-'}\nPesan:\n${input}`
  );

  ctx.reply(`✅ Report sukses ID Issue: #${bugId}`);
});

bot.command('reply', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('⚠️ Kamu bukan admin.');
  
  const args = ctx.message.text.split(' ').slice(1);
  const bugId = args.shift();
  const replyText = args.join(' ').trim();

  if (!bugId || !replyText) return ctx.reply('Gunakan: /reply [idissue] [pesan]');

  const bugs = readBugs();
  if (!bugs[bugId]) return ctx.reply('⚠️ Bug ID tidak ditemukan.');

  await bot.telegram.sendMessage(
    bugs[bugId].userId,
    `💬 Balasan dari Hekjo (ID: ${bugId}):\n${replyText}\n\n[Note: untuk Ngereply Balek Pake Command /replyadmin ${bugId} pesan]`
  );

  ctx.reply(`✅ Balasan terkirim ke user #${bugId}`);
});
bot.command('replyadmin', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const bugId = args.shift();
  const replyText = args.join(' ').trim();

  if (!bugId || !replyText) return ctx.reply('Gunakan: /replyadmin [idbug] [pesan]');

  const bugs = readBugs();
  if (!bugs[bugId]) return ctx.reply('⚠️ Bug ID tidak ditemukan.');
  await bot.telegram.sendMessage(
    ADMIN_ID,
    `💬 Balasan Client (#${bugId})\n` +
    `Nama: ${ctx.from.first_name || '-'}\n` +
    `ID: ${ctx.from.id}\n` +
    `Username: @${ctx.from.username || '-'}\n` +
    `Pesan: ${replyText}`
  );

  ctx.reply(`✅ Succes Send #${bugId}`);
});

}
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);

watchFile(__filename, () => {
  unwatchFile(__filename);
  console.log(chalk.redBright(`🟠 [WATCHDOG] ${__filename} updated! Reloading...`));
  exec('node ' + __filename);
  process.exit(0);
});


