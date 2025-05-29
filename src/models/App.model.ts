import { Schema, model, Model } from "mongoose";

interface App {
	name: string;
	clientId: string;
	clientSecret: string;
	ips: string[];
	createdAt: Date;
}

interface VisitorModel extends Model<App> {};

const schema = new Schema<App, VisitorModel>({
	name: String,
	clientId: String,
	clientSecret: String,
	ips: [String],
	createdAt: { type: Date, default: Date.now }
}, { collection: "apps" });

const App = model<App, VisitorModel>("App", schema);
export default App;