import {currentHeight, unspentBoxesFor} from "./explorer";
import {bid_address, guard_ready, guard_threshold, market_address} from "./consts";


function hexToJson(hexString) {
    // Convert hex string to a byte array
    const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

    // Convert byte array to string
    const jsonString = new TextDecoder().decode(byteArray);

    // Parse string as JSON
    return JSON.parse(jsonString);
}


function parseCustomString(input) {
    // Check if input starts with '[' and ends with ']', if not, it's invalid
    if (!input.startsWith('[') || !input.endsWith(']')) {
        throw new Error("Invalid input format");
    }

    // Remove the leading '[' and trailing ']'
    const trimmedInput = input.slice(1, -1);

    // Split the string by comma
    const elements = trimmedInput.split(',');

    // Trim whitespace from each element and return the result
    return elements.map(element => element.trim());
}


function get_market_state(guard_reports, counting_closure, currentHeight) {
    let ready_guards = 0;
    const guard_ready = 1; // assuming a threshold value for 'guard_ready'
    const guard_threshold = 3; // assuming a threshold for moving to active state

    for (let report of guard_reports) {
        if (report >= guard_ready) {
            ready_guards += 1; // increment the count of ready guards
        }
    }

    if (ready_guards >= guard_threshold) {
        if (counting_closure < currentHeight) {
            return "past";
        }
        return "active";
    }
    return "pending";
}


function summarizePledges(options, pledges) {
    // Initialize a result object with all options set to a pledge amount of 0
    const result = {};
    options.forEach(option => {
        result[option] = 0;  // Set initial pledge amount to 0
    });

    // Iterate over the array of pledge objects
    for (const pledge of pledges) {
        const { selectedIndex, pledgeValue } = pledge;

        // Get the corresponding option character using the selectedIndex
        const option = options[selectedIndex];

        // Add the pledgeValue to the existing total for the corresponding option
        result[option] += pledgeValue / 1000000000;
    }

    // Convert the result object into the required array format
    const output = Object.keys(result).map(key => ({
        option: key,
        Amount: result[key]
    }));

    return output;
}


export async function find_markets() {
    const possible_markets = await unspentBoxesFor(market_address)
    const possible_pledges = await unspentBoxesFor(bid_address)
    const height = await currentHeight()
    let markets = []
    for (let box of possible_markets) {
        try {
            if (box.creationHeight < 1348416) {
                continue
            }
            const raw_r4 = box.additionalRegisters.R4.renderedValue
            const guard_reports = JSON.parse(box.additionalRegisters.R5.renderedValue)
            const pledge_closure = JSON.parse(box.additionalRegisters.R8.renderedValue)[0]
            const counting_closure = JSON.parse(box.additionalRegisters.R8.renderedValue)[1]
            const recorded_collection_nft = parseCustomString(box.additionalRegisters.R9.renderedValue)[1]
            const r4_cleaned = hexToJson(raw_r4)
            const win_token = box.assets[1].tokenId
            const options = r4_cleaned.marketOptions
            let pledgesFound = []
            try {
                for (let pledge of possible_pledges) {
                    try {
                        const collection_nft = (pledge.additionalRegisters.R7.renderedValue)
                        const userIndex = (pledge.additionalRegisters.R4.renderedValue)
                        if (collection_nft == recorded_collection_nft) {
                            pledgesFound.push(
                                {
                                    selectedIndex: userIndex,
                                    pledgeValue: pledge.value
                                }
                            )
                        }
                    } catch (error) {
                        console.error("Error processing pledge box")
                    }
                }
            } catch (error) {
                console.error("Error processing pledge box:", box, error);
            }
            const pledge_summary = summarizePledges(options, pledgesFound)
            const indexWinner = box.additionalRegisters.R7.renderedValue
            let winner;
            try {
                winner = pledge_summary[indexWinner].option;
            } catch (error) {
                winner = -1;
            }
            markets.push({
                description: r4_cleaned.marketDescription,
                pledgesOnEachOption: pledge_summary,
                marketState: get_market_state(guard_reports, counting_closure, height),
                winningIndex: indexWinner,
                winner: winner,
                ableToPledge: pledge_closure > height,
                pledge_closure_block: pledge_closure,
                market_box: box,
                collection_nft: recorded_collection_nft,
                winner_token: win_token
            })
        } catch (error) {
            console.error("Error processing box:", box, error);
        }
    }
    console.log("Markets", markets)
    return markets
}