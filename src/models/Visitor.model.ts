import { Schema, model, Model } from "mongoose";

interface Visitor {
	firstSeen: Date;
	lastSeen: Date;
	ip: string[];
	userAgent: string[];
	getClientRects: string[];
	glDebugRenderer: string[];
	canvas: string[];
	readPixels: string[];
	pxiFullBufferHash: string[];
	pxiChecksum: string[];
}

interface VisitorModel extends Model<Visitor> {};

const schema = new Schema<Visitor, VisitorModel>({
	firstSeen: { type: Date, default: Date.now },
	lastSeen: Date,
	ip: [String],
	userAgent: [String],
	getClientRects: [String],
	glDebugRenderer: [String],
	canvas: [String],
	readPixels: [String],
	pxiFullBufferHash: [String],
	pxiChecksum: [String]
}, { collection: "visitors" });

const Visitor = model<Visitor, VisitorModel>("Visitor", schema);
export default Visitor;