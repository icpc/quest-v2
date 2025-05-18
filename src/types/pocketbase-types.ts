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
	ValidatedSubmissions = "validated_submissions",
	Validations = "validations",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
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
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type LeaderboardRecord = {
	id: string
	name?: string
	total_solved?: number
}

export enum QuestsTypeOptions {
	"VIDEO" = "VIDEO",
	"TEXT" = "TEXT",
	"IMAGE" = "IMAGE",
}
export type QuestsRecord = {
	category: string
	created?: IsoDateString
	date: string
	id: string
	name: string
	text: HTMLString
	type: QuestsTypeOptions
	updated?: IsoDateString
}

export type QuestsWithSubmissionStatsRecord = {
	count?: number
	id: string
	quest?: RecordIdString
	total_ac?: number
}

export type SubmissionsRecord = {
	attachment?: string
	created?: IsoDateString
	id: string
	quest: RecordIdString
	submitter: RecordIdString
	text?: string
	updated?: IsoDateString
}

export enum UsersRoleOptions {
	"submitter" = "submitter",
	"manager" = "manager",
	"validator" = "validator",
}
export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	role?: UsersRoleOptions[]
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type ValidatedSubmissionsRecord = {
	id: string
	quest: RecordIdString
	submission?: RecordIdString
	submitter: RecordIdString
	success?: boolean
	validation?: RecordIdString
}

export type ValidationsRecord = {
	created?: IsoDateString
	id: string
	submission: RecordIdString
	success?: boolean
	updated?: IsoDateString
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
export type ValidatedSubmissionsResponse<Texpand = unknown> = Required<ValidatedSubmissionsRecord> & BaseSystemFields<Texpand>
export type ValidationsResponse<Texpand = unknown> = Required<ValidationsRecord> & BaseSystemFields<Texpand>

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
	validated_submissions: ValidatedSubmissionsRecord
	validations: ValidationsRecord
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
	validated_submissions: ValidatedSubmissionsResponse
	validations: ValidationsResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'leaderboard'): RecordService<LeaderboardResponse>
	collection(idOrName: 'quests'): RecordService<QuestsResponse>
	collection(idOrName: 'quests_with_submission_stats'): RecordService<QuestsWithSubmissionStatsResponse>
	collection(idOrName: 'submissions'): RecordService<SubmissionsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
	collection(idOrName: 'validated_submissions'): RecordService<ValidatedSubmissionsResponse>
	collection(idOrName: 'validations'): RecordService<ValidationsResponse>
}
