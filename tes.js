let rooms = [], roomNum
const MAPWIDTH = 3
function checkInput(e) {
    if (e.key == "Enter") {
        command = cli.textContent; // use the typed command
        cli.innerHTML = ""
        parser(command)
        e.preventDefault()
    }
}
function parser(cmd) {
    if (gameOver) {
        outputText("Game over.")
        return
    }
    let cmdWords = cmd.trim().toUpperCase().split(" ")
    let verb = cmdWords[0] // first word is the verb
    let noun = cmdWords.slice(1).join(" ") // rest of it
    switch (verb) {
        case "NORTH": case "N": // heading north
            if (rooms[roomNum].exits.includes("N")) {
                roomNum -= MAPWIDTH // move up a map row
                showRoom()
            } else {
                outputText("You can't go that way")
            }
            break;

        case "SOUTH": case "S": // heading south
            if (rooms[roomNum].exits.includes("S")) {
                roomNum += MAPWIDTH // move up a map row
                showRoom()
            } else {
                outputText("You can't go that way")
            }
            break;

        case "EAST": case "E": // heading east
            console.log(roomNum)
            if (rooms[roomNum].exits.includes("E")) {

                roomNum++// move up a map row
                showRoom()
            } else {
                outputText("You can't go that way")
            }
            break;

        case "WEST": case "W": // heading west
            if (rooms[roomNum].exits.includes("W")) {
                roomNum-- // move up a map row
                showRoom()
            } else {
                outputText("You can't go that way")
            }
            break;

        case "UP": case "U": // only works in central atrium
            if (roomNum === 10) {
                roomNum = 4
                showRoom()
            } else {
                outputText("You can't go that way.")
            }
            break;

        case "DOWN": case "D": // only woreks in dorm hall
            if (roomNum === 4) {
                roomNum = 10
                showRoom()
            } else {
                outputText("You can't go that way.")
            }
            break;

        case "INVENTORY": case "INV":
            if (inventory.length === 0) {
                outputText("Your inventory is empty.")
            } else {
                outputText("You are carrying: " + inventory.join(", "))
            }
            break;

        case "INSPECT":
            // Grand Foyer (13) -> blade
            if (roomNum === 13 && !inventory.includes("BLADE")) {
                inventory.push("BLADE")
                outputText("You look closer at the statues and notice a ceremonial blade hidden at the base of one. You take it.")
            }
            // Library (14) -> find hatch
            else if (roomNum === 14 && !hatchFound) {
                hatchFound = true
                outputText("You inspect the library more carefully and notice a hidden hatch behind the heavy table.")
            }
            // Boys Bathroom (0) -> bathroom key
            else if (roomNum === 0 && !inventory.includes("BATHROOM KEY")) {
                inventory.push("BATHROOM KEY")
                outputText("At the base of the sink, something silver glints. It's a small key. You take it.")
            }
            else {
                outputText("You don't find anything useful.")
            }
            break;

        case "KILL":
            // Only works in Father Blackwood's office (room 12)
            if (roomNum !== 12) {
                outputText("There's no one to kill here.")
            } else if (blackwoodDead) {
                outputText("He's already dead.")
            } else if (!inventory.includes("BLADE")) {
                outputText("Blackwood moves first. The room goes cold, your vision blurs, and everything cuts to black. You're dead.")
                gameOver = true
            } else {
                blackwoodDead = true
                if (!inventory.includes("BASEMENT KEY")) inventory.push("BASEMENT KEY")
                outputText("You strike before he can finish his spell. Blackwood collapses. You grab a heavy iron key from the desk.")
            }
            break;

        case "TAKE":
            // Take relic in Basement Hub (room 11)
            if (noun === "RELIC" && roomNum === 11) {
                if (!inventory.includes("RELIC")) {
                    inventory.push("RELIC")
                    hasRelic = true
                    outputText("You take the ancient relic. The air instantly feels heavier.")
                } else {
                    outputText("You already have the relic.")
                }
            } else {
                outputText("You can't take that.")
            }
            break;

        case "USE":
            // Use hatch in library to escape (Room 14 -> Forest 17)
            if ((noun === "HATCH" || noun === "KEY") && roomNum === 14) {
                if (!hatchFound) {
                    outputText("You don't see anything to use here.")
                } else if (!inventory.includes("BATHROOM KEY")) {
                    outputText("The hatch is locked. You need a key.")
                } else {
                    outputText("You unlock the hatch and squeeze through...")
                    roomNum = 17
                    showRoom()
                }
            } else {
                outputText("You can't use that here.")
            }
            break;

    }
}

function showRoom() {
    outputText(rooms[roomNum].name)
    outputText(rooms[roomNum].desc)
    outputText("You can go " + rooms[roomNum].exits)
}

function initGame() {
    rooms[0] = { name: "Boys Bathroom", exits: "E", desc: "The boys bathroom is carved directly into cold stone, not tile, as if it was never meant to feel clean. Candles float near the ceiling, their flames flickering without wind. Old symbols are scratched into the walls, some crossed out, others reinforced over time. One sink is cracked down the middle, leaking dark water that smells faintly metallic. The room feels like its ignored like a place no one important ever checks.<br><br>At the base of the cracked sink, something silver briefly catches the candlelight before disappearing into shadow." }
    rooms[1] = { name: "Bathrooms", exits: "SEW", desc: "This narrow corridor splits the bathrooms, its walls lined with protective runes worn thin by years of passing students. The air smells of soap mixed with incense meant to mask something far worse. The floor creaks even when you stand still. You get the sense that this hallway exists more for convenience than care.<br><br>The boys bathroom lies to the west. The girls bathroom lies to the east." }
    rooms[2] = { name: "Girls Bathroom", exits: "W", desc: "The girls bathroom is strangely pristine compared to the rest of the academy. The mirrors are tall and spotless, reflecting the room too clearly. The candles burn steadily here, as if watched. You feel an uncomfortable pressure, like the room is quietly judging you for being here. <br><br> Nothing here feels hidden just observed." }
    rooms[3] = { name: "Boys Dorm", exits: "E", desc: "The boys dorm is cramped and chaotic, with half-made beds and books stacked in careless piles. Symbols drawn in chalk circle some beds, while others have been partially erased. The air is heavy with old magic and sleepless nights. It feels lived-in, but not safe. <br> Students come and go quickly here. No one stays too long." }
    rooms[4] = { name: "Dorm Hall", exits: "NEWD", desc: "The dorm hallway stretches longer than it should, lined with portraits of former students whose eyes seem to follow you. Candles mounted along the walls flicker nervously as you pass. The floorboards groan with every step, echoing louder than expected. Whispers drift through the hall, though no doors are open." }
    rooms[5] = { name: "Girls Dorm", exits: "W", desc: "The girls dorm is orderly, almost ritualistic. Beds are neatly arranged, and personal charms hang above each one for protection. The smell of wax and herbs fills the air. Everything looks controlled, deliberate  like chaos isnt allowed to exist here. <br><br>It feels safer than most rooms. Almost." }
    rooms[6] = { name: "Astronomy Tower", exits: "E", desc: "The astronomy tower opens to the night sky, the ceiling missing entirely. Symbols glow faintly along the stone railing, tracking stars that don’t seem natural. The wind howls upward through the tower, carrying distant chanting from below. You feel exposed here, like something above is aware of you." }
    rooms[7] = { name: "Dining Hall", exits: "SW", desc: "Long black tables dominate the dining hall, scarred by knife marks and candle burns. Students sit in small groups, whispering instead of talking. The moment you enter, several conversations stop. The smell of food mixes with iron and smoke, making your stomach tighten. <br> People notice who walks in here. And who doesn’t belong." }
    rooms[8] = { name: "Forbidden Wing", exits: "S", desc: "The forbidden wing is colder than the rest of the academy, as if the heat refuses to enter. Warning sigils cover the walls, layered on top of each other. Some are cracked. Others are fresh. The air feels thick, pressing against your chest with every breath. <br> Whatever was sealed here was sealed for a reason." }
    rooms[9] = { name: "Staff Corridor", exits: "SE", desc: "The staff corridor is narrow and oppressive, lined with tall portraits of former teachers and priests whose eyes seem to follow you as you pass. The candles here burn low and uneven, casting warped shadows along the stone walls. The air smells of old parchment, incense, and something faintly rotten beneath it all. Every sound you make feels louder here, like the corridor itself is listening. This is not a place students wander into by accident.<br>One door along the corridor stands out, heavier and more ornate than the others, marked with symbols of authority and devotion." }
    rooms[10] = { name: "Central Atrium", exits: "NSEWU", desc: "The central atrium is wide and circular, carved from black stone and etched with symbols that pulse faintly in the candlelight. At its center stands a towering statue of a horned, goat-faced figure, its stone eyes staring down at the room in silent judgment. The air hums with low, constant magic, making your skin prickle. Hallways and staircases branch out in every direction, as if the academy itself is guiding movement through its halls.<br><br>This place feels important. Whatever happens in the academy, it passes through here." }
    rooms[11] = { name: "Basement Hub", exits: "NW", desc: "A heavy iron door blocks access to the lower levels. Dark symbols pulse faintly across its surface, reacting to your presence. The metal is cold enough to sting when touched. The air beyond the door feels different older, heavier, dangerous.<br><br> This door is locked. Whatever lies behind it is meant to stay hidden." }
    rooms[12] = { name: "Father Blackwood's Office", exits: "E", desc: "Father Blackwood’s office feels charged the moment you step inside. Dark wooden shelves tower over the room, packed with ancient texts bound in cracked leather. The air is thick with incense and old magic. Blackwood stands behind his desk, one hand resting on a ritual dagger etched with symbols that glow faintly. His gaze locks onto you, sharp and calculating.<br><br>He slowly steps away from the desk, blocking the door behind you. Whatever he’s about to do, you don’t get the feeling he plans on letting you leave." }
    rooms[13] = { name: "Grand Foyer", exits: "NSE", desc: "The grand foyer rises like a cathedral, its stone arches carved with demonic figures frozen in prayer. Candles burn along the walls, their flames bending unnaturally as you pass. The floor is etched with ritual symbols meant to welcome devotion and obedience. A heavy silence hangs in the air, broken only by your footsteps echoing too loudly.<br><br>Near one of the statues, something has been deliberately placed at its base a ceremonial blade, darkened with age, its edge still sharp." }
    rooms[14] = { name: "Library", exits: "W", desc: "The library is packed wall-to-wall with ancient books, some chained shut like they might bite. Candles float between shelves, lighting the dust in the air like drifting ash. The silence feels enforced, like speaking too loudly would wake something up. A heavy wooden table sits near the middle, scratched with old ritual marks. You get the feeling this room hides more than knowledge.<br><br>If you inspect carefully, you might notice something hidden behind the table." }
    rooms[15] = { name: "Graveyard", exits: "E", desc: "This side corridor is narrow and dim, the stone here older and rougher than the rest of the academy. The candles burn low, and the shadows feel heavier. Your footsteps echo like you’re being followed, even when you stop. The air smells like damp earth mixed with incense, like the academy was built over something it doesn’t want disturbed.<br><br>It feels like this hallway connects places people don’t talk about." }
    rooms[16] = { name: "Main Entrance", exits: "NW", desc: "The main entrance doors rise tall and heavy, carved with protective symbols and warnings. Moonlight leaks through the cracks, washing the floor in pale light. For a moment, it looks like an easy way out—but the academy doesn’t feel like the kind of place that lets thieves leave politely. The air here is tense, like the building itself is waiting for a mistake.<br><br>If you’ve taken the relic, you have a bad feeling these doors won’t open again." }
    rooms[17] = { name: "Forest", exits: "S", desc: "The forest closes in around you the moment you step out from the academy, the air cold and damp against your skin. Twisted trees loom overhead, their branches blocking out most of the moonlight. The ground is uneven, roots and stones hidden beneath wet leaves. The chanting from the academy fades, replaced by distant rustling and the creak of wood in the wind.<br><br>As you move forward, you notice a narrow, barely visible path cutting through the trees deliberately hidden, but clearly used before. It feels like the only way forward." }
    rooms[19] = { name: "Sea", exits: "", desc: "You step onto a small boat drifting just off the dock, the sea stretching endlessly ahead of you. The academy disappears behind the fog as the boat drifts out to sea. <br><br> Whatever was worshipped there can’t reach you now. The relic is yours and the Church will be satisfied." }
    rooms[20] = { name: "Docks", exits: "W", desc: "The hidden path opens out onto a set of old wooden docks, slick with moisture and half-rotted by the sea air. Crates and ropes lie scattered around, some stamped with faded symbols linked to the Church. The water laps quietly against the posts, dark and patient, as if waiting. Fog hangs low over the surface, hiding whatever lies beyond the shore.<br><br>A small boat is tied loosely at the end of the dock, its lantern still lit. If you’re going to leave, this is the way." }

    roomNum = 16
    cli.focus()
    // ==== GAME OBJECTIVE ====
    outputText("OBJECTIVE")
    outputText("You have been sent by the church to infiltrate the Academy of Witchcraft and Unseen Arts")
    outputText("Steal the ancient relic hidden within the academy and escape withouth using the main entrance.")
    outputText("")

    // ==== COMMANDS ====
    outputText("COMMANDS")
    outputText("N, S, E, W - Move north, south, east, or west")
    outputText("U, D - Move up or down (only in certain areas)")
    outputText("INSPECT - Look Closely at your surroundings")
    outputText("KILL - Attack an enemy if present")
    outputText("TAKE - Pick up an item")
    outputText("INV - Check your inventory")
    showRoom()
}
function outputText(txt) {
    // add txt to a new paragraph
    let newPara = document.createElement("p")
    newPara.innerHTML = txt
    output.appendChild(newPara)
    newPara.scrollIntoView()
}

let inventory = []
let hatchFound = false
let bathroomKeyFound = false
let blackwoodDead = false
let gameOver = false
