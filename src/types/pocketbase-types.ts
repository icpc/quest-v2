/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Leaderboard = "leaderboard",
	Quests = "quests",
	QuestsWithSubmissionStats = "quests_with_submission_stats",
	Submissions = "submissions",
	Users = "users",
	ValidatedQuests = "validated_quests",
	ValidatedSubmissions = "validated_submissions",
	Validations = "validations",
	WebsiteSettings = "website_settings",
}

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type LeaderboardRecord = {
	id: string
	name?: string
	rank?: number
	total_solved?: number
	user?: RecordIdString
}

export enum QuestsTypeOptions {
	"VIDEO" = "VIDEO",
	"TEXT" = "TEXT",
	"IMAGE" = "IMAGE",
}
export type QuestsRecord = {
	can_submit?: boolean
	category: string
	created: IsoAutoDateString
	date: string
	id: string
	name: string
	text: HTMLString
	type: QuestsTypeOptions
	updated: IsoAutoDateString
	visible?: boolean
}

export type QuestsWithSubmissionStatsRecord = {
	count?: number
	id: string
	quest?: RecordIdString
	total_ac?: number
}

export type SubmissionsRecord = {
	attachment?: FileNameString
	created: IsoAutoDateString
	id: string
	quest: RecordIdString
	submitter: RecordIdString
	text?: string
	updated: IsoAutoDateString
}

export type UsersRecord = {
	avatar?: FileNameString
	can_submit?: boolean
	can_validate?: boolean
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type ValidatedQuestsRecord<Tstatus = unknown> = {
	id: string
	quest: RecordIdString
	status?: null | Tstatus
	submitter: RecordIdString
	success?: boolean
}

export type ValidatedSubmissionsRecord<Tstatus = unknown> = {
	id: string
	quest: RecordIdString
	status?: null | Tstatus
	submission?: RecordIdString
	submitter: RecordIdString
	success?: boolean
	validation?: RecordIdString
}

export type ValidationsRecord = {
	created: IsoAutoDateString
	id: string
	submission: RecordIdString
	success?: boolean
	updated: IsoAutoDateString
}

export enum WebsiteSettingsAuthOptions {
	"PASSWORD" = "PASSWORD",
	"OIDC" = "OIDC",
}
export type WebsiteSettingsRecord = {
	auth?: WebsiteSettingsAuthOptions[]
	created: IsoAutoDateString
	id: string
	logo?: FileNameString
	name?: string
	rules?: HTMLString
	updated: IsoAutoDateString
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type LeaderboardResponse<Texpand = unknown> = Required<LeaderboardRecord> & BaseSystemFields<Texpand>
export type QuestsResponse<Texpand = unknown> = Required<QuestsRecord> & BaseSystemFields<Texpand>
export type QuestsWithSubmissionStatsResponse<Texpand = unknown> = Required<QuestsWithSubmissionStatsRecord> & BaseSystemFields<Texpand>
export type SubmissionsResponse<Texpand = unknown> = Required<SubmissionsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type ValidatedQuestsResponse<Tstatus = unknown, Texpand = unknown> = Required<ValidatedQuestsRecord<Tstatus>> & BaseSystemFields<Texpand>
export type ValidatedSubmissionsResponse<Tstatus = unknown, Texpand = unknown> = Required<ValidatedSubmissionsRecord<Tstatus>> & BaseSystemFields<Texpand>
export type ValidationsResponse<Texpand = unknown> = Required<ValidationsRecord> & BaseSystemFields<Texpand>
export type WebsiteSettingsResponse<Texpand = unknown> = Required<WebsiteSettingsRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	leaderboard: LeaderboardRecord
	quests: QuestsRecord
	quests_with_submission_stats: QuestsWithSubmissionStatsRecord
	submissions: SubmissionsRecord
	users: UsersRecord
	validated_quests: ValidatedQuestsRecord
	validated_submissions: ValidatedSubmissionsRecord
	validations: ValidationsRecord
	website_settings: WebsiteSettingsRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	leaderboard: LeaderboardResponse
	quests: QuestsResponse
	quests_with_submission_stats: QuestsWithSubmissionStatsResponse
	submissions: SubmissionsResponse
	users: UsersResponse
	validated_quests: ValidatedQuestsResponse
	validated_submissions: ValidatedSubmissionsResponse
	validations: ValidationsResponse
	website_settings: WebsiteSettingsResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends any[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase
