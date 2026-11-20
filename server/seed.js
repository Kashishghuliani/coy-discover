// Deterministic mock data: 36 profiles. Every 3rd profile has already liked the
// logged-in user (`likedMe`). That flag lives ONLY on the server and is never sent to clients.
const people = [
  ["Aarav",22,"IIT Delhi","chai > coffee, fight me. will 100% beat you at chess ♟️"],
  ["Meera",21,"Delhi University","bookstore gremlin + pottery hobbyist. my mug collection has lore"],
  ["Rohan",24,"Gurugram","cycles at 6am so you don't have to. sourdough starter named Gary"],
  ["Ananya",23,"Bengaluru","designer who sketches strangers on the metro. you're in my notes app now"],
  ["Kabir",25,"Mumbai","indie gigs, street food, dad jokes. green flag with a guitar"],
  ["Isha",20,"Ashoka University","debate captain. i will argue about pineapple pizza but lovingly"],
  ["Vihaan",23,"Pune","touch grass? i touch mountains. sahyadri szn forever"],
  ["Diya",22,"Jaipur","block print obsessed, sunrise person (yes, voluntarily)"],
  ["Arjun",26,"Hyderabad","dev by day, biryani critic by night. i review ur food order"],
  ["Saanvi",21,"Chandigarh","dancing in the kitchen is my cardio. join the choreo"],
  ["Reyansh",24,"Kolkata","film club regular. satyajit ray stan, ask me why"],
  ["Tara",23,"Panipat","home baker, plant mom, night owl. my fern is thriving (unlike my sleep)"],
  ["Ishaan",22,"BITS Pilani","hackathons + 2am maggi = personality. rate my side project?"],
  ["Navya",25,"Delhi","makes zines nobody asked for. playlist swap on date one?"],
  ["Advait",27,"Noida","photographer. i'll find ur good side (it's all of them)"],
  ["Kiara",20,"Lady Shri Ram College","poetry slams + filter coffee. soft launch my feelings here"],
  ["Dev",24,"Ahmedabad","garba champ 3 yrs running. my dandiya has its own case"],
  ["Myra",22,"Shimla","mountains, mulled drinks, mixtapes. main character in the hills"],
  ["Samar",23,"Lucknow","old-city food walks + urdu couplets. i'll romanticise ur chai"],
  ["Zoya",24,"Bhopal","marine bio nerd stuck far from the sea. send help (and octopus facts)"],
  ["Neil",21,"Manipal","football, fusion music, fresh starts. my aux is elite"],
  ["Riya",26,"Gurugram","startup girlie who still makes time for pottery. work-life balance? maybe"],
  ["Yash",22,"Kurukshetra","ex-wrestler, yoga convert. flexibility is my love language"],
  ["Anika",23,"Chennai","carnatic singer. ask me for a raga, get a whole concert 🎤"],
  ["Parth",25,"Surat","board game host. bring snacks or lose by default"],
  ["Pihu",21,"Ambala","thrift queen. everything i own has a backstory and a bargain"],
  ["Krish",24,"Indore","poha evangelist + standup hobbyist. my roasts are consensual"],
  ["Sia",22,"Dehradun","rock climbing, rainy days, reading. low-key outdoorsy, high-key cozy"],
  ["Veer",26,"Amritsar","dhaba road trips + dhol practice. my neighbours are thriving"],
  ["Aditi",25,"Mysuru","yoga teacher with a full ghibli collection. spirited away on repeat"],
  ["Rudra",23,"Goa","surf at dawn, code by noon, nap by 2. 10/10 schedule"],
  ["Mahi",22,"Rohtak","cricket stats nerd + cold coffee addict. ask me about the 2011 final"],
  ["Lakshya",24,"Kochi","sailing, jazz, fish curry. i'm basically a sea shanty"],
  ["Ira",21,"Jamia Millia","street photography + long walks. i'll take your candid, you'll love it"],
  ["Ayaan",27,"Delhi","chef in training. second date is dinner, i'm cooking 🍳"],
  ["Nisha",23,"Karnal","volunteer teacher + amateur astronomer. we can stargaze, no pressure"],
];
const pool = ["🎵 Music","✈️ Travel","🥾 Trekking","🍳 Cooking","📸 Photos","📚 Books","🎬 Films","🧘 Yoga","🎮 Gaming","🎨 Art","💃 Dance","☕ Coffee","🏏 Cricket","⚽ Football","✍️ Poetry","🎧 Podcasts","🏺 Pottery","🚴 Cycling","🚀 Startups","🎤 Standup"];

export function seedProfiles() {
  return people.map(([name, age, place, bio], i) => ({
    id: i + 1,
    name, age, place, bio,
    photo: `https://picsum.photos/seed/coy-${i + 1}/600/800`,
    interests: [0, 1, 2, 3].map((k) => pool[(i * 7 + k * 5) % pool.length]).filter((v, idx, a) => a.indexOf(v) === idx),
    likedMe: i % 3 === 0,
  }));
}
