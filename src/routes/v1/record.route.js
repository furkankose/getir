const express = require('express');
const validate = require('../../middlewares/validate');
const recordValidation = require('../../validations/record.validation');
const recordController = require('../../controllers/record.controller');

const router = express.Router();

router.route('/').get(validate(recordValidation.getRecords), recordController.getRecords);
router.route('/').post(validate(recordValidation.getAggregatedRecords), recordController.getAggregatedRecords);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Records
 */

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Get aggregated records
 *     tags: [Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *               - minCount
 *               - maxCount
 *             properties:
 *               startDate:
 *                 type: string
 *                 enum: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               minCount:
 *                 type: number
 *               maxCount:
 *                 type: number
 *             example:
 *               startDate: 2016-01-26
 *               endDate: 2018-02-02
 *               minCount: 2700
 *               maxCount: 3000
 *     responses:
 *       "200":
 *         description: It returns aggregated records by considering specified dates and counts
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/AggregatedRecord'
 *
 *   get:
 *     summary: Get records
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           format: date
 *         example: 2016-01-26
 *         description: The date when the record created
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         description: Key
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         description: Value
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of records
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: It returns paginated records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Record'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 */
