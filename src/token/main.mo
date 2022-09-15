import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
actor Token {
    // converting principal id to type Principal
    let owner : Principal = Principal.fromText("tvyzh-7zgeo-igqxr-yg4qp-t7hyj-6ba7r-xoknc-lwmw7-zyops-oobem-pae");
    let totalSupply : Nat = 1000000000;
    let symbol : Text = "FLEX";

// creating an array of tuples
    private stable var balanceEntries : [(Principal, Nat)] = [];
 // A ledger; balances variable which is set to a hashmap having it's key as a principal datatype representing the id of a user or canister and it's value as Nat datatype representing amount of custome token owned.
    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
     if (balances.size() < 1 ){
              // adding the owner to the balance ledger as the first entry
                balances.put(owner, totalSupply);
        };


    // a function to query in order to find out who owns how much
    public query func balanceOf(who : Principal) : async Nat {
        let balance : Nat = switch(balances.get(who)){
            case null 0;
            case (?result) result;
        };

        return balance
    };

    public query func getSymbol() : async Text{
        return symbol;
    };
// creating the faucet functionality using the shared keyword.
    public shared (msg) func payOut() : async Text {
        if (balances.get(msg.caller) == null){
            let amount = 10000;
            let result = await transfer(msg.caller, amount);
            return result;
        }
        else{
            return "Already Claimed";
        };
    };

// implementing the transfer functionality
    public shared(msg) func transfer(to : Principal, amount : Nat) : async Text {
        let fromBalance = await(balanceOf(msg.caller));
        if (fromBalance > amount){
            let newFromBalance : Nat = fromBalance - amount;
            balances.put(msg.caller, newFromBalance);

            let toBalance = await balanceOf(to);
            let newToBalance = amount + toBalance;
            balances.put (to, newToBalance);
            return "Success";
        }
        else{
            return "Insufficient Amount of Token";
        }
    };


    system func preupgrade(){
        balanceEntries := Iter.toArray(balances.entries());
    };

    system func postupgrade(){
        balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
        if (balances.size() < 1 ){
              // adding the owner to the balance ledger as the first entry
                balances.put(owner, totalSupply);
        };
    };

};