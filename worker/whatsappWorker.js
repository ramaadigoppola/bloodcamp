const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const cron = require("node-cron");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

console.log("Starting WhatsApp Reminder Worker...");

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./.wwebjs_auth"
  })
});

/*
QR LOGIN (ONLY FIRST TIME)
*/
client.on("qr", (qr) => {
  console.log("Scan this QR with WhatsApp (Production Login)");
  qrcode.generate(qr, { small: true });
});

/*
READY EVENT
*/
client.on("ready", () => {
  console.log("WhatsApp Client Ready ✅");

  startSchedulers();
});

/*
FETCH DONORS FROM DATABASE
*/
async function getDonors() {

  const donors = await prisma.donor.findMany({
    where: {
      mobile: {
        not: null
      }
    }
  });

  return donors;
}

/*
SEND IMAGE ONLY
*/
async function sendReminder(imageName) {

  const donors = await getDonors();

  console.log("Sending reminder to:", donors.length, "donors");

  const imagePath = path.join(__dirname, "..", "public", imageName);

  const media = MessageMedia.fromFilePath(imagePath);

  const TEST_NUMBERS = [
  "8297745402",
  "9014970993"
];

  for (const donor of donors) {

    if (!donor.mobile) continue;

    let mobile = donor.mobile.replace(/\D/g, "");

    if (!TEST_NUMBERS.includes(mobile)) {

    console.log("Skipping:", mobile);

    continue;
  }

    if (mobile.length === 10) {
      mobile = "91" + mobile;
    }

    const chatId = `${mobile}@c.us`;

    try {

      await client.sendMessage(chatId, media);

      console.log("Sent to:", donor.name, mobile);

      await new Promise(r => setTimeout(r, 8000));

    } catch (err) {

      console.log("Failed:", mobile);

    }

  }

}

/*
SCHEDULERS
*/
function startSchedulers() {

  cron.schedule("* * * * *", async () => {

    console.log("Running 36hr reminder");

    await sendReminder("36hrs.jpeg");

  });

  /*
  36 HOUR REMINDER
  16 March 7:30 PM
  */
  cron.schedule("30 19 16 3 *", async () => {

    console.log("Running 36hr reminder");

    await sendReminder("36hrs.jpeg");

  });

  /*
  16 HOUR REMINDER
  17 March 7:30 PM
  */
  cron.schedule("30 19 17 3 *", async () => {

    console.log("Running 16hr reminder");

    await sendReminder("16hrs.jpeg");

  });

}

client.initialize();