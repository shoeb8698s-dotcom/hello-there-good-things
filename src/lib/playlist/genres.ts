import type { GenreRules } from './types';
import { ppxNormalizeName, ppxGetAttribute, ppxLine } from './utils';
import { PPX_JIO_CATEGORY_PREFIX } from './constants';

const GENRE_RULES: GenreRules = {
  exact: {
    "dd9 chandana (kannada)": "Entertainment", "dd5 podhigai": "Entertainment", "brit asia": "Music",
    "jus one hd": "Devotional", "set": "Entertainment", "set hd": "Entertainment", "sony sab": "Entertainment",
    "sony sab hd": "Entertainment", "sony pal": "Entertainment", "sony aath": "Entertainment", "sony marathi": "Entertainment",
    "sony max hd": "Movies", "sony max1": "Movies", "sony max2": "Movies", "sony pix hd": "Movies", "sony wah": "Movies",
    "zee talkies": "Movies", "zee talkies hd": "Movies", "zee cinemalu": "Movies", "zee cinemalu hd": "Movies",
    "& pictures": "Movies", "& pictures hd": "Movies", "mn+ hd": "Movies", "cnn": "News", "wion": "News",
    "otv": "News", "ntv": "News", "t news": "News", "i news": "News", "newslive": "News", "news live": "News",
    "times now": "News", "times now world": "News", "india tv": "News", "india today": "News", "dd national": "Entertainment",
    "dd bharati": "Entertainment", "dd kisan": "Infotainment", "epic tv": "Entertainment", "india science": "Education",
    "good times": "Lifestyle", "good times hd": "Lifestyle", "ftv hd": "Lifestyle", "ptc punjabi gold": "Movies",
    "sadhna gold": "Devotional", "goodnews channel": "Devotional", "sadhna": "Devotional", "disha tv": "Devotional",
    "shalom": "Devotional", "mh1 shraddha": "Devotional", "aradhana tv": "Devotional", "hindu dharmam": "Devotional",
    "fateh tv": "Devotional", "ptc simran": "Devotional", "svbc2": "Devotional", "svbc3": "Devotional", "svbc4": "Devotional",
    "radhekrishna tv": "Devotional", "atmadarshan tv": "Devotional", "aadinath tv": "Devotional", "shekinah tv": "Devotional",
    "grace tv": "Devotional", "amritwani tv": "Devotional", "jay jagannath": "Devotional", "om tv": "Devotional",
    "goodness": "Devotional", "hhdl": "Devotional", "mirror now": "News", "ibc24": "News", "chardikla time tv": "News",
    "sudarshan": "News", "dd india": "News", "janta tv": "News", "india voice": "News", "taaza tv": "News",
    "kalinga tv": "News", "total tv": "News", "inh 24x7": "News", "dnn": "News", "jantantra": "News",
    "jai maharashtra": "News", "nhk world japan": "News", "reporter tv": "News", "nandighosha": "News",
    "headlines tripura": "News", "kolkata tv": "News", "gomantak tv": "News", "badakhabar": "News", "ind 24": "News",
    "24hrs tv": "News", "anaadi tv": "News", "nd 24": "News", "hornbill tv": "News", "buletin india": "News",
    "z10 tv": "News", "nl tv": "News", "pulse 24": "News", "munsif tv": "News", "asom live 24": "News",
    "bharat express": "News", "m nadu": "News", "power tv": "News", "abc australia": "News", "daily post phh": "News",
    "99 tv": "News", "public first": "News", "bangla jago": "News", "tamil janam": "News", "tni awaaz": "News",
    "taiwan plus": "News", "live times": "News", "public asia": "News", "the unmute": "News", "voice tv urdu": "News",
    "soochna india": "News", "nbs live tv": "News", "mirror media": "News", "stv bangla": "News", "mega9tv": "News",
    "tv13 gujarati": "News", "headlines kolkata": "News", "pradesh24 gujarati": "News", "ntc tv": "News", "amar ujala": "News",
    "india ahead": "News", "rashtriya pahal": "News", "d tamil": "Infotainment", "and xplore hd": "Infotainment",
    "raj musix": "Music", "kappa tv": "Music", "jio games hd": "Specials", "star utsav": "Entertainment",
    "colors cineplex hd": "Movies", "mtv hd": "Music", "disney channel": "Kids", "eros universe bollywood cinema": "Movies",
    "yrf music": "Music", "sonic hindi": "Kids", "star plus hd": "Entertainment", "nh bollyflix": "Movies",
    "shemaroo filmy gaane": "Music", "pogo hindi": "Kids", "star gold 2 hd": "Movies", "9x jalwa": "Music",
    "epic kids": "Kids", "sun gemini hd": "Entertainment", "star gold romance": "Movies", "9xm": "Music",
    "nickelodeon jr": "Kids", "colors rishtey": "Entertainment", "star gold select hd": "Movies", "saga music": "Music",
    "hungama": "Kids", "colors super": "Entertainment", "star utsav movies": "Movies", "colors cineplex bollywood": "Movies",
    "9x tashan": "Music", "discovery kids hindi": "Kids", "shemaroo tv": "Entertainment", "eros universe entertainment": "Movies",
    "wild earth": "Infotainment", "pitaara": "Movies", "shemaroo umang": "Entertainment", "super hungama": "Kids",
    "star jalsha hd": "Entertainment", "colors cineplex superhit": "Movies", "maa movies hd": "Movies",
    "sun music hd": "Music", "colors marathi hd": "Entertainment", "star pravah hd": "Entertainment",
    "sun surya movies": "Movies", "maa hd": "Entertainment", "etv beats": "Music", "animal planet hd hindi": "Infotainment",
    "zb cinema": "Movies", "asianet hd": "Entertainment", "etv cinema hd": "Movies", "star vijay hd": "Entertainment",
    "sun gemini comedy": "Entertainment", "star gold hd": "Movies", "etv life": "Infotainment", "etv music": "Music",
    "history tv18 hd": "Infotainment", "sun bangla": "Entertainment", "tarang music": "Music", "star kiran": "Entertainment",
    "sun udaya music": "Music", "suvarna hd": "Entertainment", "colors gujarati": "Entertainment", "epic bhojpuri": "Movies",
    "disney junior": "Kids", "sun life": "Movies", "shemaroo bollywood": "Movies", "sun gemini music hd": "Music",
    "zb cartoon": "Kids", "sun neo hd": "Entertainment", "etv andhra pradesh": "News", "colors bangla hd": "Entertainment",
    "sangeet marathi": "Music", "discovery hd hindi": "Infotainment", "etv josh": "Entertainment", "9x jhakaas": "Music",
    "nick hindi": "Kids", "sun gemini life": "Movies", "tarang": "Entertainment", "etv telugu": "Entertainment",
    "sun marathi": "Entertainment", "saga music haryanvi": "Music", "etv telangana": "News", "sun gemini movies hd": "Movies",
    "vijay super hd": "Movies", "colors bangla cinema": "Movies", "sun surya hd": "Entertainment", "epic bharat": "Entertainment",
    "sangeet bangla": "Music", "sun surya comedy": "Entertainment", "colors kannada cinema": "Movies", "star gold thrills": "Movies",
    "etv plus hd": "Entertainment", "shemaroo marathibana": "Movies", "sun surya music": "Music", "colors gujarati cinema": "Movies",
    "sun tv hd": "Entertainment", "etv hd": "Entertainment", "colors kannada hd": "Entertainment", "sidharth tv": "Entertainment",
    "colors tamil hd": "Entertainment", "suvarna plus": "Movies", "roja movies": "Movies", "sun udaya movies": "Movies",
    "cartoon network hindi": "Kids", "jalsha movies hd": "Movies", "sun udaya comedy": "Entertainment", "vijay takkar": "Movies",
    "disney international hd": "Kids", "star pravah picture hd": "Movies", "asianet movies hd": "Movies", "maa gold": "Movies",
    "swastik stories": "Entertainment", "sangeet bhojpuri": "Music", "sun udaya hd": "Entertainment", "travelxp hd hindi": "Lifestyle",
    "aaj tak": "News", "tv9 bharatvarsh": "News", "abp ananda": "News", "republic bharat": "News", "news 18 india": "News",
    "zee news": "News", "abp news india": "News", "zee business": "Business", "republic tv": "News", "abp majha": "News",
    "bbc news gujarati": "News", "ndtv": "News", "zee 24 taas": "News", "tv9 bangla": "News", "ndtv india": "News",
    "zee mp chattisgarh": "News", "india news gujarat": "News", "raj news kannada": "News", "polimer news": "News",
    "zee 24 kalak": "News", "abp ganga": "News", "bbc news hindi": "News", "news18 odia": "News", "zee kannada news": "News",
    "cnn news18": "News", "tv9 gujarati": "News", "raj news telugu": "News", "news 9": "News", "india news rajasthan": "News",
    "suvarna news": "News", "raj news malayalam": "News", "cnbc awaaz": "Business", "zee punjab haryana hp": "News",
    "firstpost": "News", "abp asmita": "News", "india news punjab": "News", "times now navbharat": "News", "tv9 kannada": "News",
    "ndtv profit": "Business", "tv9 marathi": "News", "india news haryana": "News", "abp sanjha": "News", "bloomberg tv+": "Business",
    "bbc news marathi": "News", "good news today": "News", "zee delhi ncr haryana": "News", "dd news": "News",
    "india news": "News", "news nation": "News", "tv9 telugu": "News", "india news mp": "News", "zee 24 ghanta": "News",
    "india news up": "News", "b4u movies": "Movies", "sony ten 1 hd": "Sports", "sony ten 2 hd": "Sports",
    "sony ten 3 hd hindi": "Sports", "sony ten 5 hd": "Sports", "red bull tv": "Sports", "lancs tv hd": "Sports",
    "eurosport hd": "Sports", "brave tv": "Sports", "all women's sports network": "Sports", "pickleball now": "Sports",
    "star movies hd": "Movies", "etv cinema": "Movies", "star movies select hd": "Movies", "nh bollygold": "Movies",
    "b4u kadak": "Movies", "hooplakidz tv": "Kids", "pogo telugu": "Kids", "cartoon network hd+ hindi": "Kids",
    "pogo tamil": "Kids", "duck tv": "Kids", "pogo marathi": "Kids", "power kids tv": "Kids", "unique tv": "Entertainment",
    "pogo kannada": "Kids", "nick hd+": "Kids", "chintu tv": "Kids", "sonic telugu": "Kids", "sonic marathi": "Kids",
    "nick junior": "Kids", "sonic kannada": "Kids", "sony yay hindi": "Kids", "cartoon network hd+ telugu": "Kids",
    "sonic tamil": "Kids", "nick bangla": "Kids", "cartoon network hd+ malayalam": "Kids", "sonic malayalam": "Kids",
    "nick malayalam": "Kids", "cartoon network hd+ tamil": "Kids", "nick kannada": "Kids", "sonic bangla": "Kids",
    "cartoon network hd+ marathi": "Kids", "nick marathi": "Kids", "nick tamil": "Kids", "cartoon network hd+ kannada": "Kids",
    "nick telugu": "Kids", "pogo malayalam": "Kids", "discovery kids telugu": "Kids", "discovery kids malayalam": "Kids",
    "discovery kids tamil": "Kids", "discovery kids kannada": "Kids", "chutti tv": "Kids", "cartoon network tamil": "Kids",
    "kushi tv": "Kids", "cartoon network telugu": "Kids", "cartoon network marathi": "Kids", "kochu tv": "Kids",
    "cartoon network malayalam": "Kids", "cartoon network kannada": "Kids", "padel time tv": "Sports", "tv30 india": "News",
    "focus plus tv": "News", "lokmat bharat": "News", "vistara news": "News", "etv news": "News", "knock news": "News",
    "onkar news": "News", "k news india": "News", "first india news": "News", "india tv aap ki adalat": "News",
    "india tv speed news": "News", "kadak": "News", "euro news": "News", "news x": "News", "news x world": "News",
    "rt india": "News", "channel news asia international": "News", "dw": "News", "al jazeera": "News", "yahoo finance": "Business",
    "bloomberg originals": "Business", "cnbc tv18": "Business", "et now": "Business", "cnbc tv18 prime": "Business",
    "et now swadesh": "Business", "news18 kerala": "News", "r bangla": "News", "manorama news": "News", "mathrubhumi news": "News",
    "public tv": "News", "sun news": "News", "ndtv marathi": "News", "thanthi tv": "News", "news18 assam ne": "News",
    "asianet news": "News", "news18 kannada": "News", "prag news": "News", "news18 bangla": "News", "zee bihar jharkhand": "News",
    "mahua khabar": "News", "news18 gujarati": "News", "news18 tamil nadu": "News", "saam tv": "News", "news18 marathi": "News",
    "jaihind tv": "News", "news18 bihar jharkhand": "News", "ptc news": "News", "jaya plus": "News", "raj news 24x7": "News",
    "mahaa news": "News", "gtc news": "News", "r kannada": "News", "kairali news": "News", "pudhari news": "News", "win tv": "News",
    "gujarat 1st 24x7": "News", "big tv 24x7": "News", "times of maharashtra": "News", "news j": "News", "news time tv": "News",
    "newslive bangla": "News", "r plus": "News", "ctvn akd plus": "News", "calcutta news": "News", "bhoomi 24x7": "News",
    "tara tv": "News", "express news": "News", "ananda barta": "News", "ktv bangla": "News", "amar bangla tv": "News",
    "raatdin bangla": "News", "globe tv": "News", "samay kolkata": "News", "bhi channel": "News", "nk tv bangla": "News",
    "zillar barta": "News", "akhon kolkata": "News", "raatdin tripura": "News", "tv 5 kannada": "News", "news first": "News",
    "janataa tv kannada": "News", "karnataka news beat": "News", "guarantee news": "News", "sathiyam tv": "News",
    "news7 tamil": "News", "malaimurasu seithigal": "News", "news tamil 24x7": "News", "tamilan television": "News",
    "velicham tv": "News", "kalaignar seithigal": "News", "thanthi one": "Entertainment", "history hd nw18": "Infotainment",
    "rongeen tv": "Kids", "ktv": "Movies", "ktv hd": "Movies", "star suvarna plus": "Movies", "star vijay super": "Movies",
    "vijay super": "Movies", "raj digital plus": "Movies", "ramdhenu": "Music", "stingray djazz": "Music",
    "stingray todays k pop": "Music", "janam tv": "News", "gs tv": "News", "vtv gujarati": "News", "gurkibani": "Devotional",
    "pmc telugu": "Devotional", "jothi tv": "Devotional", "channel win": "Devotional", "kcm": "Devotional", "ayush tv": "Lifestyle",
    "gujarat wild tv": "Infotainment", "aakash aath": "Entertainment", "adithya tv": "Entertainment", "amrita tv": "Entertainment",
    "anjan tv": "Entertainment", "anmol tv": "Entertainment", "asianet": "Entertainment", "asianet plus": "Entertainment",
    "ar re": "Entertainment", "arre": "Entertainment", "big magic": "Entertainment", "dangal": "Entertainment",
    "dangal 2": "Entertainment", "flower tv": "Entertainment", "gangaur": "Entertainment", "jaya tv": "Entertainment",
    "jeevan tv": "Entertainment", "jonack": "Entertainment", "kairali tv": "Entertainment", "kairali we tv": "Entertainment",
    "kalaignar tv": "Entertainment", "kaumudy tv": "Entertainment", "makkal tv": "Entertainment", "mazhavil manorama": "Entertainment",
    "moon tv": "Entertainment", "nepal one": "Entertainment", "pasand": "Entertainment", "peppers tv": "Entertainment",
    "polimer tv": "Entertainment", "ptc punjabi": "Entertainment", "punjab plus": "Entertainment", "puthu yugam": "Entertainment",
    "raj tv": "Entertainment", "rang": "Entertainment", "rupashi bangla": "Entertainment", "siri kannada": "Entertainment",
    "spondon": "Entertainment", "sristi tv": "Entertainment", "suvarna": "Entertainment", "tv5 monde": "Entertainment",
    "vaanavil tv": "Entertainment", "vasanth tv": "Entertainment", "vendhar tv": "Entertainment", "vissa tv": "Entertainment",
  },
  patterns: [
    ["Kids", ["\\b(?:discovery kids|chutti|chintu|kushi|kochu|cbeebies|baby tv|etv bal bharat|balbharat|rongeen|hooplakidz|cartoon|kids)\\b"]],
    ["Movies", ["\\b(?:ktv|vijay super|suvarna plus|cine jomjomat|superfine films|b4u bhojpuri)\\b"]],
    ["Infotainment", ["\\bhistory (?:hd|tv18)\\b"]],
    ["Music", ["\\bstingray (?:djazz|todays k pop)\\b"]],
    ["Sports", ["\\bsports?\\b", "\\beurosport\\b", "\\bfox sports\\b", "\\btsn\\s*\\d*\\b", "\\bsony (?:ten|liv sports)\\b", "\\bstar sports\\b", "\\bdd sports\\b", "\\bjio sports\\b", "\\bred bull tv\\b", "\\bpickleball\\b", "\\bpentathlon\\b"]],
    ["Business", ["\\bcnbc\\b", "\\bet now\\b", "\\bndtv profit\\b", "\\bzee business\\b", "\\bbloomberg\\b", "\\byahoo finance\\b", "\\bbusiness\\b"]],
    ["Kids", ["\\bcartoon network\\b", "^nick(?:elodeon)?\\b", "\\bnick jr\\b", "\\bsonic\\b", "\\bpogo\\b", "\\bdisney\\b", "\\bhungama\\b", "\\bsony yay\\b", "\\banimax\\b", "\\bhooplakidz\\b", "\\bgreen gold tv\\b", "\\bpower kids\\b", "\\bepic kids\\b", "\\bzb cartoon\\b", "\\bkochu tv\\b"]],
    ["Devotional", ["\\baastha\\b", "\\bbhakti\\b", "\\bbhakthi\\b", "\\bdevotional\\b", "\\bspiritual\\b", "\\bsanskar\\b", "\\bsatsang\\b", "\\bjinvani\\b", "\\bdharma\\b", "\\bdharm\\b", "\\bsanatan\\b", "\\bvedic\\b", "\\bvedant\\b", "\\bhare krsna\\b", "\\bhare krishna\\b", "\\biskcon\\b", "\\bsvbc\\b", "\\bprarthana\\b", "\\bprabhu vani\\b", "\\bprabhu sandesh\\b", "\\bsai tv\\b", "\\bsai leela\\b", "\\bsri sankara\\b", "\\bsri naga sai\\b", "\\bshri shyam\\b", "\\bshree sanatan\\b", "\\bshree salangpur\\b", "\\bsubhavartha\\b", "\\bshubhsandesh\\b", "\\bshubh tv\\b", "\\bsharnam\\b", "\\bsoham\\b", "\\bparas tv\\b", "\\bishwar tv\\b", "\\bdarshan 24\\b", "\\bdivya vani\\b", "\\bdivyalok\\b", "\\bdivya tv\\b", "\\bcalvary\\b", "\\bmercy tv\\b", "\\bangel tv\\b", "\\bgospel tv\\b", "\\bloveworld tv\\b", "\\bharvest tv\\b", "\\bpowervision tv\\b", "\\bmadha tv\\b", "\\bkripa tv\\b", "\\bpeace of mind\\b", "\\bad(hy|hya)atma\\b", "\\bmanav dharam\\b", "\\bnimbark\\b", "\\bsantvani\\b", "\\bsikh ratnavali\\b", "\\bgurbani\\b", "\\btehzeeb tv\\b", "\\bcvr om\\b", "\\bnambikkai\\b", "\\bshri amarnathji\\b", "\\bsadhguru\\b", "\\bmah[a]*a bhakthi\\b", "\\bmanas bhakti\\b", "\\bjeewan bhakti\\b", "\\bprarthana life\\b", "\\bdharsan tv\\b", "\\bgodlywood\\b"]],
    ["Education", ["\\bpm e vidya\\b", "\\bswayam prabha\\b", "\\bdd swayam\\b", "\\bdd sathee\\b", "\\bvande gujarat\\b", "\\bschool tv\\b", "\\bshiksha tv\\b", "\\bdigishala\\b", "\\bgyandarshan\\b", "\\bgyanvani\\b", "\\bkite victers\\b", "\\bevidya\\b", "\\bbirla brainiacs\\b", "\\bt sat (?:nipuna|vidya)\\b", "\\bsubharti\\b"]],
    ["Infotainment", ["\\bdiscovery\\b", "\\banimal planet\\b", "\\bhistory tv(?:18)?\\b", "\\bsony bbc earth\\b", "\\bbbc earth\\b", "\\bnat(?:ional)? geo(?:graphic)?\\b", "\\bwild earth\\b", "\\bdocubay\\b", "\\binwild\\b", "\\bindia science\\b", "\\bsafari tv\\b", "\\bstingray naturescape\\b", "\\bepic bharat\\b", "\\bepic bhojpuri\\b", "\\band xplore\\b"]],
    ["Lifestyle", ["\\btravelxp\\b", "\\bintravel\\b", "\\bjourny\\b", "\\btlc\\b", "\\bfood(?: food|xp)?\\b", "\\bgusto tv\\b", "\\bzee zest\\b", "\\bfashion\\b", "\\bftv\\b", "\\bluxe tv\\b", "\\bcvr health\\b", "\\byoga channel\\b", "\\bzenlife\\b", "\\bholidaycapes\\b", "\\bstingray the spa\\b"]],
    ["Music", ["\\bmusic\\b", "\\bmtv\\b", "\\b9xm\\b", "\\b9x jalwa\\b", "\\b9x jhakaas\\b", "\\b9x tashan\\b", "\\bzoom\\b", "\\bzing\\b", "\\be 24\\b", "\\bjaya max\\b", "\\bpublic music\\b", "\\btunes?\\b", "\\bgaane\\b", "\\bsangeet\\b", "\\bsongdew\\b", "\\bballe balle\\b", "\\bchak de\\b", "\\bmerchant records\\b", "\\byrf music\\b", "\\bgha(i|)nt punjab\\b", "\\btabbar hits\\b", "\\bpunjabi (?:hits|melodies)\\b", "\\boye music\\b", "\\bzb music\\b", "\\bstingray (?:classic rock|greatest hits|cozy cafe|todays k pop|easy listening|2000s)\\b", "\\bmovie music by stingray\\b", "\\bqello concerts\\b", "\\bmusix\\b"]],
    ["Movies", ["\\bmovies?\\b", "\\bcinema\\b", "\\bcineplex\\b", "\\bsony max\\d*\\b", "\\bsony pix\\b", "\\bsony wah\\b", "\\bstar gold\\b", "\\bstar maa gold\\b", "\\bmaa gold\\b", "\\bjalsha movies\\b", "\\bpravah picture\\b", "\\bzee (?:action|bollywood|classic|biskope|thirai)\\b", "(?:^|\\s)& pictures\\b", "\\band pictures\\b", "\\b& flix\\b", "\\band flix\\b", "\\bromedy now\\b", "\\bmnx\\b", "\\bmn\\+\\b", "\\bgoldmines\\b", "\\b35mm\\b", "\\bbollywood\\b", "\\bbollyflix\\b", "\\bbollygold\\b", "\\bhiff movies\\b", "\\bpocket films\\b", "\\blionsgate play\\b", "\\bb4u kadak\\b", "\\bpublic movies\\b", "\\bzb cinema\\b", "\\bsidharth gold\\b", "\\balankar\\b", "\\bmah[a]*a max\\b", "\\bj movies\\b", "\\bjio(?: exclusive| specials)\\b"]],
    ["News", ["\\bnews(?:live|\\d+)?\\b", "\\bnewz\\b", "\\bsamachar\\b", "\\bkhabar\\b", "\\bkhabar\\d*\\b", "\\baaj tak\\b", "\\babp\\b", "\\btv9\\b", "\\bndtv (?:india|24x7|marathi)\\b", "\\brepublic\\b", "\\btimes now\\b", "\\bcnn\\b", "\\bal jazeera\\b", "\\bdw\\b", "\\bfrance 24\\b", "\\beuro news\\b", "\\beuronews\\b", "\\bfirstpost\\b", "\\bchannel news asia\\b", "\\bsansad tv\\b", "\\bparliament\\b", "\\bindia today\\b", "\\bindia tv\\b", "\\bnews18\\b", "\\bnetwork 18\\b", "\\bwion\\b", "\\bjaihind tv\\b", "\\bmathrubhumi\\b", "\\bmanorama news\\b", "\\bmedia one tv\\b", "\\bputhiya thalimurai\\b", "\\bthanthi tv\\b", "\\bthanthi one\\b", "\\bpolimer news\\b", "\\bpublic tv\\b", "\\bsuvarna news\\b", "\\bsakshi tv\\b", "\\babn andhra jyothi\\b", "\\bhm tv\\b", "\\bntv\\b", "\\botv\\b", "\\bkanak news\\b", "\\bjaya plus\\b", "\\braj news\\b", "\\bprag news\\b", "\\bpratidin time\\b", "\\bdy 365\\b", "\\bnorth east live\\b", "\\bassam talks\\b", "\\bv6 news\\b", "\\b10 tv\\b", "\\b6 tv\\b", "\\btv 5 news\\b", "\\bnews7 tamil\\b", "\\bsathiyam tv\\b", "\\bnews j\\b", "\\btime8\\b", "\\bbharat 24\\b", "\\bglobal india\\b", "\\babc news\\b", "\\bto[i1] global\\b", "\\bzee 24 (?:taas|ghanta|kalak)\\b", "\\bzee (?:bharat|up uk|mp chattisgarh|rajasthan|bihar jharkhand|delhi ncr haryana|punjab haryana hp)\\b", "\\bseithigal\\b", "\\bheadlines\\b", "\\breporter\\b", "\\breport\\b", "\\bbu(?:lletin|letin)\\b", "\\b24x7\\b", "\\b24hrs\\b", "\\bnation(?:al)? (?:today|update|tv india|ne)\\b", "\\btimes of maharashtra\\b", "\\braatdin\\b", "\\braftaar (?:media|samay)\\b", "\\bbharat (?:atoz|nation|update|tv24)\\b", "\\bindia (?:daily|24x7|ahead)\\b", "\\bprajatantra\\b", "\\bpublic asia\\b"]],
    ["Shopping", ["\\bnaaptol\\b", "\\bshop(?:ping)?\\b", "\\bhome shop\\b"]],
    ["Specials", ["^test\\d*\\b", "\\bjio events\\b", "\\bjio ?games\\b", "\\bvr live\\b", "\\bbh ott india fest\\b"]],
    ["Entertainment", ["^(?:star (?:plus|bharat|jalsha|kiran|maa|pravah|suvarna|utsav|vijay)|zee (?:tv|bangla|kannada|marathi|sarthak|tamil|telugu|punjabi|yuva|power|keralam)|colors|sun (?:tv|bangla|marathi|neo|gemini|surya|udaya)|dd )\\b", "\\b(?:entertainment|comedy|serials?)\\b"]],
  ],
  aliases: {
    "entertainment": "Entertainment", "sport": "Sports", "sports": "Sports", "movie": "Movies", "movies": "Movies",
    "news": "News", "business news": "Business", "business": "Business", "music": "Music", "kids": "Kids",
    "children": "Kids", "devotional": "Devotional", "religious": "Devotional", "education": "Education",
    "educational": "Education", "infotainment": "Infotainment", "documentary": "Infotainment", "lifestyle": "Lifestyle",
    "shopping": "Shopping", "special": "Specials", "specials": "Specials", "live sports streamx": "Sports",
  },
};

export function ppxGenreRules(): GenreRules {
  return GENRE_RULES;
}

export function ppxJioCategory(
  header: string,
  directives: string[],
  name = '',
): string {
  const rules = ppxGenreRules();
  const normalized = ppxNormalizeName(
    name !== '' ? name : ppxGetAttribute(header, 'tvg-name'),
  );

  if (rules.exact[normalized]) return rules.exact[normalized];

  const baseName = normalized.replace(/\s+(?:hd\+?|sd|4k)$/i, '').trim();
  if (rules.exact[baseName]) return rules.exact[baseName];

  for (const [category, patterns] of rules.patterns) {
    for (const pattern of patterns) {
      if (new RegExp(pattern, 'i').test(normalized)) {
        return category;
      }
    }
  }

  const candidates: string[] = [
    ppxGetAttribute(header, 'tvg-category'),
    ppxGetAttribute(header, 'group-title'),
  ];
  for (const line of directives) {
    const m = line.match(/^#EXTGRP:\s*(.*)$/i);
    if (m) candidates.push(m[1]);
  }
  for (const candidate of candidates) {
    const category = ppxLine(candidate)
      .replace(/^Jio\s*TV\s*\+\s*\|\s*/i, '')
      .trim();
    const key = ppxNormalizeName(category);
    if (rules.aliases[key]) return rules.aliases[key];
  }

  return 'Other';
}
