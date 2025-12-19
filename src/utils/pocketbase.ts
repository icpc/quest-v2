import PocketBase from "pocketbase";

import { TypedPocketBase } from "@/types/pocketbase-types";

import { POCKETBASE_URL } from "./env";

const pb = new PocketBase(POCKETBASE_URL) as TypedPocketBase;
pb.autoCancellation(false);

export default pb;
