import { Service, type OnInit } from "@flamework/core";
import DataStore2 from "@rbxts/datastore2";

import { DataKey, DataValue, DataKeys } from "shared/data-models/generic";
import { Events, Functions } from "server/network";
import type { OnPlayerJoin } from "server/hooks";
import Log from "shared/logger";

const { initializeData, setData, incrementData, dataLoaded, dataUpdate } = Events;
const { getData } = Functions;

@Service({ loadOrder: 0 })
export class DataService implements OnInit, OnPlayerJoin {
	public onInit(): void {
		DataStore2.Combine("DATA", ...DataKeys);
		initializeData.connect((player) => this.setup(player));
		setData.connect((player, key, value) => this.set(player, key, value));
		incrementData.connect((player, key, amount) => this.increment(player, key, amount))
		getData.setCallback((player, key) => this.get(player, key));
	}

	public onPlayerJoin(player: Player): void {
		this.setup(player);
	}

	public increment(player: Player, key: DataKey, amount = 1): void {
		const value = this.get<number>(player, key);
		this.set(player, key, value + amount);
	}

	public get<T extends DataValue = DataValue>(player: Player, key: DataKey): T {
		const store = this.getStore<T>(player, key);
		return store.Get()!;
	}

	public set<T extends DataValue = DataValue>(player: Player, key: DataKey, value: T): void {
		const store = this.getStore<T>(player, key);
		store.Set(value);
	}

	private setup(player: Player): void {
		// initialize all data with a default value
    this.initialize(player, "coins", 25);
    this.initialize(player, "stars", 0);
		this.initialize(player, "diamonds", 0);
		this.initialize(player, "keybinds", ["D", "F", "J", "K", "L"]);
		this.initialize(player, "songScores", []);

		Log.info("Initialized data");
		dataLoaded(player);
	}

	private initialize<T extends DataValue = DataValue>(
		player: Player,
		key: DataKey,
		defaultValue: T
	): void {

		const store = this.getStore(player, key);
		const value = store.Get(defaultValue);
		this.sendToClient(player, key, value);
		store.OnUpdate((value) => this.sendToClient(player, key, value));
	}

	private sendToClient<T extends DataValue = DataValue>(
		player: Player,
		key: DataKey,
		value: T
	): void {

		dataUpdate(player, key, value);
	}

	private getStore<T extends DataValue = DataValue>(player: Player, key: DataKey): DataStore2<T> {
    // if you ever wanna wipe all data, just change the keyID
    // you can also use it to separate test databases and production databases
    const keyID = "TEST"; // change to PROD on release
		return DataStore2<T>(keyID + "_" + key, player);
	}
}