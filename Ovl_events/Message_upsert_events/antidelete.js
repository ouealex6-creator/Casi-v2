const { WA_CONF } = require('../../DataBase/wa_conf');

async function antidelete(ovl, msg, botJid, type, getMsg, ownerJid, destJid) {
  const conf = await WA_CONF.findOne({ where: { id: '1' } });
  if (!conf) return;

  try {
    const mode = conf.antidelete;
    const allowed = ['pm', 'gc', 'all', 'both', 'gcpm', 'status', 'pmgc'];
    if (!allowed.includes(mode)) return;

    if (type !== 'protocolMessage') return;

    const proto = msg.message?.protocolMessage;
    if (!proto?.key?.id) return;

    const original = getMsg(proto.key.id);
    if (!original) return;

    // Envoie UNIQUEMENT à toi (owner)
    await ovl.sendMessage(ownerJid, {
      text: '🗑️ *Message supprimé détecté*\n_(Visible uniquement par le owner)_'
    }, { quoted: original });

    await ovl.sendMessage(ownerJid, {
      forward: original
    }, { quoted: original });

  } catch (err) {
    console.error('Erreur antidelete:', err);
  }
}

module.exports = antidelete;
