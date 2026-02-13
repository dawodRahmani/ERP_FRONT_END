import {
  Plus,
  ChevronLeft,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApplicationForm } from './useApplicationForm';
import { PROFICIENCY_LEVELS, MARITAL_STATUS_OPTIONS, NATIONALITY_OPTIONS } from './data';
import { formStyles as s } from './styles';

const ApplicationForm = () => {
  const {
    formData,
    isEdit,
    handleChange,
    addRecord,
    updateRecord,
    removeRecord,
    handleSubmit,
    handleCancel,
  } = useApplicationForm();

  return (
    <div className={s.page}>
      {/* ─── Header ─── */}
      <div className={s.headerRow}>
        <div className={s.headerLeft}>
          <Link to="/hr/recruitment/applications" className={s.backLink}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className={s.title}>
              {isEdit ? 'Edit Application' : 'New Job Application'}
            </h1>
            <p className={s.subtitle}>Annex 4: Job Application Template</p>
          </div>
        </div>
        <div className={s.headerActions}>
          <button onClick={handleCancel} className={s.secondaryButton}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={s.primaryButton}>
            <Save className="h-4 w-4" />
            Save Application
          </button>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardBody}>

          {/* ════════════════════════════════════════════════
              Section 1: Position Applied For
             ════════════════════════════════════════════════ */}
          <div>
            <h2 className={s.sectionTitle}>Position Applied For</h2>
            <div className={s.grid3}>
              <div className="lg:col-span-2">
                <label className={s.label}>
                  Which position are you applying for? <span className={s.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.positionApplied}
                  onChange={(e) => handleChange('positionApplied', e.target.value)}
                  className={s.input}
                  placeholder="Enter position title"
                />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              Section 2: Personal Information
             ════════════════════════════════════════════════ */}
          <div>
            <h2 className={s.sectionTitle}>Personal Information</h2>
            <div className={s.grid3}>
              {/* Name */}
              <div>
                <label className={s.label}>
                  Name <span className={s.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={s.input}
                  placeholder="Full name"
                />
              </div>

              {/* Father Name */}
              <div>
                <label className={s.label}>
                  Father's Name <span className={s.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => handleChange('fatherName', e.target.value)}
                  className={s.input}
                  placeholder="Father's name"
                />
              </div>

              {/* Nationality */}
              <div>
                <label className={s.label}>
                  Nationality <span className={s.required}>*</span>
                </label>
                <select
                  value={formData.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  className={s.select}
                >
                  {NATIONALITY_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className={s.label}>
                  Date of Birth <span className={s.required}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className={s.input}
                />
              </div>

              {/* Marital Status + Number of Children */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={s.label}>
                      Marital Status <span className={s.required}>*</span>
                    </label>
                    <div className={s.radioGroup}>
                      {MARITAL_STATUS_OPTIONS.map((opt) => (
                        <label key={opt.value} className={s.radioLabel}>
                          <input
                            type="radio"
                            checked={formData.maritalStatus === opt.value}
                            onChange={() => handleChange('maritalStatus', opt.value)}
                            className={s.radio}
                          />
                          <span className={s.radioText}>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.maritalStatus === 'married' && (
                    <div>
                      <label className={s.label}>If Married, Number of Children</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.numberOfChildren}
                        onChange={(e) => handleChange('numberOfChildren', e.target.value)}
                        className={s.input}
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className={s.label}>
                  Contact Phone / Mobile # <span className={s.required}>*</span>
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className={s.input}
                  placeholder="+93 7XX XXX XXX"
                />
              </div>

              {/* Permanent Address */}
              <div className={s.fullSpan}>
                <label className={s.label}>
                  Permanent Address <span className={s.required}>*</span>
                </label>
                <textarea
                  value={formData.permanentAddress}
                  onChange={(e) => handleChange('permanentAddress', e.target.value)}
                  rows={2}
                  className={s.textarea}
                  placeholder="Permanent address"
                />
              </div>

              {/* Present Address */}
              <div className={s.fullSpan}>
                <label className={s.label}>
                  Present Address <span className={s.required}>*</span>
                </label>
                <textarea
                  value={formData.presentAddress}
                  onChange={(e) => handleChange('presentAddress', e.target.value)}
                  rows={2}
                  className={s.textarea}
                  placeholder="Present address"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className={s.label}>Photo</label>
                <div className="flex items-center gap-2">
                  <label className={`${s.secondaryButton} cursor-pointer`}>
                    <Upload className="h-4 w-4" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleChange('photo', file.name);
                      }}
                    />
                  </label>
                  {formData.photo && (
                    <span className="text-sm text-gray-500">{formData.photo}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              Section 3: Knowledge of Languages
             ════════════════════════════════════════════════ */}
          <div>
            <div className={s.sectionHeader}>
              <h2 className={s.sectionTitle}>Knowledge of Languages</h2>
              <button onClick={() => addRecord('languages')} className={s.addButton}>
                <Plus className="h-4 w-4" />
                Add Language
              </button>
            </div>
            {formData.languages.length === 0 ? (
              <p className={s.emptyText}>No languages added. Click "Add Language" to add.</p>
            ) : (
              <div className={s.recordList}>
                {formData.languages.map((lang, idx) => (
                  <div key={lang.id} className={s.recordCard}>
                    <div className={s.recordHeader}>
                      <span className={s.recordTitle}>Language #{idx + 1}</span>
                      <button onClick={() => removeRecord('languages', lang.id)} className={s.removeButton}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className={s.grid4}>
                      <div>
                        <label className={s.label}>Language</label>
                        <input
                          type="text"
                          value={lang.language}
                          onChange={(e) => updateRecord('languages', lang.id, 'language', e.target.value)}
                          className={s.input}
                          placeholder="e.g. Dari, Pashto, English"
                        />
                      </div>
                      {(['reading', 'writing', 'speaking'] as const).map((skill) => (
                        <div key={skill}>
                          <label className={s.label}>{skill.charAt(0).toUpperCase() + skill.slice(1)}</label>
                          <select
                            value={lang[skill]}
                            onChange={(e) => updateRecord('languages', lang.id, skill, e.target.value)}
                            className={s.select}
                          >
                            {PROFICIENCY_LEVELS.map((l) => (
                              <option key={l.value} value={l.value}>{l.label}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════
              Section 4: Education
             ════════════════════════════════════════════════ */}
          <div>
            <div className={s.sectionHeader}>
              <h2 className={s.sectionTitle}>Education</h2>
              <button onClick={() => addRecord('education')} className={s.addButton}>
                <Plus className="h-4 w-4" />
                Add Education
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 -mt-2">
              Please give full details about your educational level in original language. Do not translate the degree titles.
            </p>
            {formData.education.length === 0 ? (
              <p className={s.emptyText}>No education records added. Click "Add Education" to add.</p>
            ) : (
              <div className={s.recordList}>
                {formData.education.map((edu, idx) => (
                  <div key={edu.id} className={s.recordCard}>
                    <div className={s.recordHeader}>
                      <span className={s.recordTitle}>Education #{idx + 1}</span>
                      <button onClick={() => removeRecord('education', edu.id)} className={s.removeButton}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className={s.grid4}>
                      <div>
                        <label className={s.label}>Institution Name</label>
                        <input
                          type="text"
                          value={edu.institutionName}
                          onChange={(e) => updateRecord('education', edu.id, 'institutionName', e.target.value)}
                          className={s.input}
                          placeholder="Institution name"
                        />
                      </div>
                      <div>
                        <label className={s.label}>Place</label>
                        <input
                          type="text"
                          value={edu.place}
                          onChange={(e) => updateRecord('education', edu.id, 'place', e.target.value)}
                          className={s.input}
                          placeholder="City / Province"
                        />
                      </div>
                      <div>
                        <label className={s.label}>Country</label>
                        <input
                          type="text"
                          value={edu.country}
                          onChange={(e) => updateRecord('education', edu.id, 'country', e.target.value)}
                          className={s.input}
                          placeholder="Country"
                        />
                      </div>
                      <div>
                        <label className={s.label}>Attended From (Month-Year)</label>
                        <input
                          type="month"
                          value={edu.attendedFrom}
                          onChange={(e) => updateRecord('education', edu.id, 'attendedFrom', e.target.value)}
                          className={s.input}
                        />
                      </div>
                      <div>
                        <label className={s.label}>Attended To (Month-Year)</label>
                        <input
                          type="month"
                          value={edu.attendedTo}
                          onChange={(e) => updateRecord('education', edu.id, 'attendedTo', e.target.value)}
                          className={s.input}
                        />
                      </div>
                      <div>
                        <label className={s.label}>Degrees & Academic Distinction</label>
                        <input
                          type="text"
                          value={edu.degreesObtained}
                          onChange={(e) => updateRecord('education', edu.id, 'degreesObtained', e.target.value)}
                          className={s.input}
                          placeholder="Degree obtained"
                        />
                      </div>
                      <div>
                        <label className={s.label}>Main Courses of Study</label>
                        <input
                          type="text"
                          value={edu.mainCourses}
                          onChange={(e) => updateRecord('education', edu.id, 'mainCourses', e.target.value)}
                          className={s.input}
                          placeholder="Main courses"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════
              Section 5: Formal Trainings / Workshops
             ════════════════════════════════════════════════ */}
          <div>
            <div className={s.sectionHeader}>
              <h2 className={s.sectionTitle}>Formal Trainings, Workshops & Seminars</h2>
              <button onClick={() => addRecord('trainings')} className={s.addButton}>
                <Plus className="h-4 w-4" />
                Add Training
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 -mt-2">
              List formal trainings, workshops or other educational seminars in chronological order.
            </p>
            {formData.trainings.length === 0 ? (
              <p className={s.emptyText}>No training records added. Click "Add Training" to add.</p>
            ) : (
              <div className={s.recordList}>
                {formData.trainings.map((tr, idx) => (
                  <div key={tr.id} className={s.recordCard}>
                    <div className={s.recordHeader}>
                      <span className={s.recordTitle}>Training #{idx + 1}</span>
                      <button onClick={() => removeRecord('trainings', tr.id)} className={s.removeButton}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className={s.grid4}>
                      <div>
                        <label className={s.label}>Training Name</label>
                        <input
                          type="text"
                          value={tr.trainingName}
                          onChange={(e) => updateRecord('trainings', tr.id, 'trainingName', e.target.value)}
                          className={s.input}
                          placeholder="Training / workshop name"
                        />
                      </div>
                      <div>
                        <label className={s.label}>Place</label>
                        <input
                          type="text"
                          value={tr.place}
                          onChange={(e) => updateRecord('trainings', tr.id, 'place', e.target.value)}
                          className={s.input}
                          placeholder="City / Province"
                        />
                      </div>
                      <div>
                        <label className={s.label}>Country</label>
                        <input
                          type="text"
                          value={tr.country}
                          onChange={(e) => updateRecord('trainings', tr.id, 'country', e.target.value)}
                          className={s.input}
                          placeholder="Country"
                        />
                      </div>
                      <div>
                        <label className={s.label}>Type</label>
                        <input
                          type="text"
                          value={tr.type}
                          onChange={(e) => updateRecord('trainings', tr.id, 'type', e.target.value)}
                          className={s.input}
                          placeholder="e.g. Workshop, Seminar, Course"
                        />
                      </div>
                      <div>
                        <label className={s.label}>Attended From (Month-Year)</label>
                        <input
                          type="month"
                          value={tr.attendedFrom}
                          onChange={(e) => updateRecord('trainings', tr.id, 'attendedFrom', e.target.value)}
                          className={s.input}
                        />
                      </div>
                      <div>
                        <label className={s.label}>Attended To (Month-Year)</label>
                        <input
                          type="month"
                          value={tr.attendedTo}
                          onChange={(e) => updateRecord('trainings', tr.id, 'attendedTo', e.target.value)}
                          className={s.input}
                        />
                      </div>
                      <div>
                        <label className={s.label}>Degrees & Academic Distinction</label>
                        <input
                          type="text"
                          value={tr.degreesObtained}
                          onChange={(e) => updateRecord('trainings', tr.id, 'degreesObtained', e.target.value)}
                          className={s.input}
                          placeholder="Degree obtained"
                        />
                      </div>
                      <div>
                        <label className={s.label}>Certificates or Diploma Obtained</label>
                        <input
                          type="text"
                          value={tr.certificatesDiploma}
                          onChange={(e) => updateRecord('trainings', tr.id, 'certificatesDiploma', e.target.value)}
                          className={s.input}
                          placeholder="Certificate / diploma"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════
              Section 6: Employment Record
             ════════════════════════════════════════════════ */}
          <div>
            <div className={s.sectionHeader}>
              <h2 className={s.sectionTitle}>Employment Record</h2>
              <button onClick={() => addRecord('employment')} className={s.addButton}>
                <Plus className="h-4 w-4" />
                Add Employment
              </button>
            </div>
            {formData.employment.length === 0 ? (
              <p className={s.emptyText}>No employment records added. Click "Add Employment" to add.</p>
            ) : (
              <div className={s.recordList}>
                {formData.employment.map((emp, idx) => (
                  <div key={emp.id} className={s.recordCard}>
                    <div className={s.recordHeader}>
                      <span className={s.recordTitle}>Employment #{idx + 1}</span>
                      <button onClick={() => removeRecord('employment', emp.id)} className={s.removeButton}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className={s.grid3}>
                      <div>
                        <label className={s.label}>From</label>
                        <input
                          type="month"
                          value={emp.from}
                          onChange={(e) => updateRecord('employment', emp.id, 'from', e.target.value)}
                          className={s.input}
                        />
                      </div>
                      <div>
                        <label className={s.label}>To</label>
                        <input
                          type="month"
                          value={emp.to}
                          onChange={(e) => updateRecord('employment', emp.id, 'to', e.target.value)}
                          className={s.input}
                        />
                      </div>
                      <div>
                        <label className={s.label}>Job Title / Position</label>
                        <input
                          type="text"
                          value={emp.jobTitle}
                          onChange={(e) => updateRecord('employment', emp.id, 'jobTitle', e.target.value)}
                          className={s.input}
                          placeholder="Job title"
                        />
                      </div>
                      <div className="lg:col-span-3">
                        <label className={s.label}>Description of Major Duties</label>
                        <textarea
                          value={emp.majorDuties}
                          onChange={(e) => updateRecord('employment', emp.id, 'majorDuties', e.target.value)}
                          rows={2}
                          className={s.textarea}
                          placeholder="Major duties and responsibilities"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className={s.label}>Name, Address & Contact # of Employer</label>
                        <textarea
                          value={emp.employerNameAddressContact}
                          onChange={(e) => updateRecord('employment', emp.id, 'employerNameAddressContact', e.target.value)}
                          rows={2}
                          className={s.textarea}
                          placeholder="Employer name, address, and contact"
                        />
                      </div>
                      <div>
                        <label className={s.label}>Reason for Leaving</label>
                        <input
                          type="text"
                          value={emp.reasonForLeaving}
                          onChange={(e) => updateRecord('employment', emp.id, 'reasonForLeaving', e.target.value)}
                          className={s.input}
                          placeholder="Reason for leaving"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════
              Section 7: Organizational Questions
             ════════════════════════════════════════════════ */}
          <div>
            <h2 className={s.sectionTitle}>Organizational Questions</h2>
            <div className="space-y-6">
              {/* Q1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    1. Do you have any relative in this organization?
                  </label>
                  <div className={s.yesNoGroup}>
                    <label className={s.radioLabel}>
                      <input
                        type="radio"
                        checked={formData.hasRelativeInOrg === true}
                        onChange={() => handleChange('hasRelativeInOrg', true)}
                        className={s.radio}
                      />
                      <span className={s.radioText}>Yes</span>
                    </label>
                    <label className={s.radioLabel}>
                      <input
                        type="radio"
                        checked={formData.hasRelativeInOrg === false}
                        onChange={() => handleChange('hasRelativeInOrg', false)}
                        className={s.radio}
                      />
                      <span className={s.radioText}>No</span>
                    </label>
                  </div>
                </div>
                {formData.hasRelativeInOrg && (
                  <div>
                    <label className={s.label}>If yes, please give full details about him/her</label>
                    <textarea
                      value={formData.relativeDetails}
                      onChange={(e) => handleChange('relativeDetails', e.target.value)}
                      rows={2}
                      className={s.textarea}
                      placeholder="Relative's name, position, department, and relationship"
                    />
                  </div>
                )}
              </div>

              {/* Q2 */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  2. Have you ever been arrested, indicted or summoned into court for a criminal proceeding?
                </label>
                <div className={s.yesNoGroup}>
                  <label className={s.radioLabel}>
                    <input
                      type="radio"
                      checked={formData.everArrested === true}
                      onChange={() => handleChange('everArrested', true)}
                      className={s.radio}
                    />
                    <span className={s.radioText}>Yes</span>
                  </label>
                  <label className={s.radioLabel}>
                    <input
                      type="radio"
                      checked={formData.everArrested === false}
                      onChange={() => handleChange('everArrested', false)}
                      className={s.radio}
                    />
                    <span className={s.radioText}>No</span>
                  </label>
                </div>
              </div>

              {/* Q3 */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  3. Have you ever been convicted, fined or imprisoned for the violation of any laws?
                </label>
                <div className={s.yesNoGroup}>
                  <label className={s.radioLabel}>
                    <input
                      type="radio"
                      checked={formData.everConvicted === true}
                      onChange={() => handleChange('everConvicted', true)}
                      className={s.radio}
                    />
                    <span className={s.radioText}>Yes</span>
                  </label>
                  <label className={s.radioLabel}>
                    <input
                      type="radio"
                      checked={formData.everConvicted === false}
                      onChange={() => handleChange('everConvicted', false)}
                      className={s.radio}
                    />
                    <span className={s.radioText}>No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              Section 8: References
             ════════════════════════════════════════════════ */}
          <div>
            <div className={s.sectionHeader}>
              <h2 className={s.sectionTitle}>References</h2>
              <button onClick={() => addRecord('references')} className={s.addButton}>
                <Plus className="h-4 w-4" />
                Add Reference
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 -mt-2">
              List three persons not related to you who are familiar with your character and qualifications.
            </p>
            {formData.references.length === 0 ? (
              <p className={s.emptyText}>No references added. Click "Add Reference" to add.</p>
            ) : (
              <div className={s.recordList}>
                {formData.references.map((ref, idx) => (
                  <div key={ref.id} className={s.recordCard}>
                    <div className={s.recordHeader}>
                      <span className={s.recordTitle}>Reference #{idx + 1}</span>
                      <button onClick={() => removeRecord('references', ref.id)} className={s.removeButton}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className={s.grid3}>
                      <div>
                        <label className={s.label}>Full Name</label>
                        <input
                          type="text"
                          value={ref.fullName}
                          onChange={(e) => updateRecord('references', ref.id, 'fullName', e.target.value)}
                          className={s.input}
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className={s.label}>Full Address & Telephone #</label>
                        <input
                          type="text"
                          value={ref.fullAddressPhone}
                          onChange={(e) => updateRecord('references', ref.id, 'fullAddressPhone', e.target.value)}
                          className={s.input}
                          placeholder="Address and phone number"
                        />
                      </div>
                      <div>
                        <label className={s.label}>Business or Occupation</label>
                        <input
                          type="text"
                          value={ref.businessOccupation}
                          onChange={(e) => updateRecord('references', ref.id, 'businessOccupation', e.target.value)}
                          className={s.input}
                          placeholder="Occupation"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════
              Section 9: Data Consent & Signature
             ════════════════════════════════════════════════ */}
          <div>
            <h2 className={s.sectionTitle}>Data Consent & Signature</h2>
            <div className={s.consentBox}>
              <label className={s.consentLabel}>
                <input
                  type="checkbox"
                  checked={formData.dataConsent}
                  onChange={(e) => handleChange('dataConsent', e.target.checked)}
                  className={`mt-1 ${s.checkbox}`}
                />
                <span className={s.consentText}>
                  I allow the organization to keep my data for their HR purposes for up to 7 years.
                </span>
              </label>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={s.label}>Date</label>
                <input
                  type="date"
                  value={formData.signatureDate}
                  onChange={(e) => handleChange('signatureDate', e.target.value)}
                  className={s.input}
                />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              Section 10: For Official Use Only
             ════════════════════════════════════════════════ */}
          <div className={s.officialBanner}>
            <h2 className={s.officialTitle}>For Official Use Only</h2>

            <div className={s.grid3}>
              <div>
                <label className={s.label}>Application Received By</label>
                <input
                  type="text"
                  value={formData.applicationReceivedBy}
                  onChange={(e) => handleChange('applicationReceivedBy', e.target.value)}
                  className={s.input}
                />
              </div>
              <div>
                <label className={s.label}>Date of Appointment</label>
                <input
                  type="date"
                  value={formData.dateOfAppointment}
                  onChange={(e) => handleChange('dateOfAppointment', e.target.value)}
                  className={s.input}
                />
              </div>
              <div>
                <label className={s.label}>Place of Appointment</label>
                <input
                  type="text"
                  value={formData.placeOfAppointment}
                  onChange={(e) => handleChange('placeOfAppointment', e.target.value)}
                  className={s.input}
                />
              </div>
              <div>
                <label className={s.label}>Salary</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => handleChange('salary', e.target.value)}
                  className={s.input}
                />
              </div>
            </div>

            {/* Examiners */}
            <div className="mt-6">
              <div className={s.sectionHeader}>
                <label className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Interview and Examination Taken By
                </label>
                <button onClick={() => addRecord('examiners')} className={s.addButton}>
                  <Plus className="h-4 w-4" />
                  Add Examiner
                </button>
              </div>
              {formData.examiners.length === 0 ? (
                <p className={s.emptyText}>No examiners added.</p>
              ) : (
                <div className={s.recordList}>
                  {formData.examiners.map((ex, idx) => (
                    <div key={ex.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className={s.recordHeader}>
                        <span className={s.recordTitle}>Examiner #{idx + 1}</span>
                        <button onClick={() => removeRecord('examiners', ex.id)} className={s.removeButton}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className={s.grid3}>
                        <div>
                          <label className={s.label}>Name</label>
                          <input
                            type="text"
                            value={ex.name}
                            onChange={(e) => updateRecord('examiners', ex.id, 'name', e.target.value)}
                            className={s.input}
                          />
                        </div>
                        <div>
                          <label className={s.label}>Department</label>
                          <input
                            type="text"
                            value={ex.department}
                            onChange={(e) => updateRecord('examiners', ex.id, 'department', e.target.value)}
                            className={s.input}
                          />
                        </div>
                        <div>
                          <label className={s.label}>Position</label>
                          <input
                            type="text"
                            value={ex.position}
                            onChange={(e) => updateRecord('examiners', ex.id, 'position', e.target.value)}
                            className={s.input}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Score */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={s.label}>Score Obtained</label>
                <input
                  type="number"
                  value={formData.scoreObtained}
                  onChange={(e) => handleChange('scoreObtained', e.target.value)}
                  className={s.input}
                />
              </div>
              <div>
                <label className={s.label}>Out Of</label>
                <input
                  type="number"
                  value={formData.scoreOutOf}
                  onChange={(e) => handleChange('scoreOutOf', e.target.value)}
                  className={s.input}
                />
              </div>
            </div>

            {/* Official Yes/No questions */}
            <div className="mt-6 space-y-4">
              {([
                { field: 'papersAttached' as const, label: 'Are the papers attached to this Personal History Form?' },
                { field: 'notSuitable' as const, label: 'Not suitable for this position?' },
                { field: 'keepPending' as const, label: 'Keep the application pending?' },
              ] as const).map(({ field, label }) => (
                <div key={field} className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                  <div className={s.yesNoGroup}>
                    <label className={s.radioLabel}>
                      <input
                        type="radio"
                        checked={formData[field] === true}
                        onChange={() => handleChange(field, true)}
                        className={s.radio}
                      />
                      <span className={s.radioText}>Yes</span>
                    </label>
                    <label className={s.radioLabel}>
                      <input
                        type="radio"
                        checked={formData[field] === false}
                        onChange={() => handleChange(field, false)}
                        className={s.radio}
                      />
                      <span className={s.radioText}>No</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Not employed reason */}
            <div className="mt-4">
              <label className={s.label}>Not employed because of</label>
              <input
                type="text"
                value={formData.notEmployedReason}
                onChange={(e) => handleChange('notEmployedReason', e.target.value)}
                className={s.input}
              />
            </div>

            {/* HR Specialist */}
            <div className="mt-4">
              <label className={s.label}>Signed By - HR Specialist</label>
              <input
                type="text"
                value={formData.hrSpecialist}
                onChange={(e) => handleChange('hrSpecialist', e.target.value)}
                className={s.input}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
