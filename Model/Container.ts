/**
 * A container of variables, etc.  Used for base classes ({@see Duration}, etc.) to get variable values.
 */
export default interface Container {

    /**
     * Get the FTP specified for the workout.
     */
    getFTP(): number;

}
