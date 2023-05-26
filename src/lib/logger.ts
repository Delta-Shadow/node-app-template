import path from 'path'
import { createLogger, format, transports, type transport } from 'winston'
import { isProd } from './utils'

// Log file locations and names
const root = process.cwd()
const log_folder = 'logs'
const prod_log_filename = 'prod'
const err_log_filename = 'error'
const dev_log_filename = 'dev'
const extension = '.log'

// Log files
const prod_log_file = path.join(root, log_folder, prod_log_filename + extension)
const dev_log_file = path.join(root, log_folder, dev_log_filename + extension)
const err_log_file = path.join(root, log_folder, err_log_filename + extension)

// Default transport
const _transports: Array<transport> = [
	new transports.File({
		level: 'error',
		filename: err_log_file,
		format: format.combine(format.timestamp(), format.json(), format.metadata())
	})
]

if (isProd()) {
	// Prod transports
	_transports.push(
		new transports.File({
			level: 'info',
			filename: prod_log_file,
			format: format.combine(format.timestamp(), format.json(), format.metadata())
		})
	)
} else {
	// Dev transports
	_transports.push(
		new transports.File({
			level: 'debug',
			filename: dev_log_file,
			format: format.combine(
				format.timestamp(),
				format.json(),
				format.metadata(),
				format.prettyPrint(),
				format.align()
			)
		}),
		new transports.Console({
			level: 'debug',
			format: format.combine(
				format.json(),
				format.prettyPrint(),
				format.errors(),
				format.metadata()
			)
		})
	)
}

const logger = createLogger({
	transports: _transports
})

export default logger
