import {
  ChevronLeft,
  Save,
  Send,
  AlertTriangle,
  Upload,
  Download,
  Trash2,
  FileText,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCOIForm } from './useCOIForm';
import { useActiveDropdownsByCategory } from '../../../../hooks/recruitment';
import {
  CONFLICT_QUESTIONS,
  DECLARATION_TEXT,
  TRANSPARENCY_NOTE,
  YES_NO_OPTIONS,
  ACCEPTED_FILE_TYPES,
} from './data';
import { coiStyles as s } from './styles';

const COIForm = () => {
  const {
    formData,
    isEdit,
    hasAnyConflict,
    fileError,
    fileInputRef,
    handleChange,
    handleConflictAnswer,
    handleFileUpload,
    removeFile,
    downloadFile,
    triggerFileInput,
    formatFileSize,
    handleSubmit,
    handleCancel,
  } = useCOIForm();

  const { data: committeeRoles = [] } = useActiveDropdownsByCategory('committeeRole');
  const { data: departments = [] } = useActiveDropdownsByCategory('department');
  const { data: reviewDecisions = [] } = useActiveDropdownsByCategory('reviewDecision');

  return (
    <div className={s.page}>
      {/* ─── Header ─── */}
      <div className={s.headerRow}>
        <div className={s.headerLeft}>
          <Link to="/hr/recruitment/conflict-of-interest" className={s.backLink}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className={s.title}>
              {isEdit ? 'Edit COI Declaration' : 'New COI Declaration'}
            </h1>
            <p className={s.subtitle}>Annex 5: Conflict of Interest (COI) Form</p>
          </div>
        </div>
        <div className={s.headerActions}>
          <button onClick={handleCancel} className={s.secondaryButton}>
            Cancel
          </button>
          <button onClick={() => handleSubmit('save')} className={s.secondaryButton}>
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button onClick={() => handleSubmit('submit')} className={s.primaryButton}>
            <Send className="h-4 w-4" />
            Submit
          </button>
        </div>
      </div>

      {/* ─── Conflict Warning ─── */}
      {hasAnyConflict && (
        <div className={s.warningBanner}>
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
          <p className={s.warningText}>
            Potential conflict of interest identified. HR Specialist review is required before this member can participate in the recruitment process.
          </p>
        </div>
      )}

      <div className={s.card}>
        <div className={s.cardBody}>

          {/* ════════════════════════════════════════════════
              Section 1: Personal Information
             ════════════════════════════════════════════════ */}
          <div>
            <h2 className={s.sectionTitle}>
              <span className={s.sectionNumber}>1</span>
              Personal Information
            </h2>
            <div className={s.grid3}>
              <div>
                <label className={s.label}>
                  Name <span className={s.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.memberName}
                  onChange={(e) => handleChange('memberName', e.target.value)}
                  className={s.input}
                  placeholder="Full name of RC member"
                />
              </div>

              <div>
                <label className={s.label}>
                  Position in RC <span className={s.required}>*</span>
                </label>
                <select
                  value={formData.positionInRC}
                  onChange={(e) => handleChange('positionInRC', e.target.value)}
                  className={s.select}
                >
                  <option value="">Select Position</option>
                  {committeeRoles.map((opt) => (
                    <option key={opt.id} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={s.label}>
                  Department <span className={s.required}>*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className={s.select}
                >
                  <option value="">Select Department</option>
                  {departments.map((opt) => (
                    <option key={opt.id} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={s.label}>
                  Date <span className={s.required}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.declarationDate}
                  onChange={(e) => handleChange('declarationDate', e.target.value)}
                  className={s.input}
                />
              </div>

              <div>
                <label className={s.label}>
                  Recruitment Position <span className={s.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.recruitmentPosition}
                  onChange={(e) => handleChange('recruitmentPosition', e.target.value)}
                  className={s.input}
                  placeholder="Position being recruited for"
                />
              </div>

              <div>
                <label className={s.label}>Vacancy Number</label>
                <input
                  type="text"
                  value={formData.vacancyNumber}
                  onChange={(e) => handleChange('vacancyNumber', e.target.value)}
                  className={s.input}
                  placeholder="e.g. VA-2026-001"
                />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              Section 2: Declaration of Potential COI
             ════════════════════════════════════════════════ */}
          <div>
            <h2 className={s.sectionTitle}>
              <span className={s.sectionNumber}>2</span>
              Declaration of Potential Conflict of Interest
            </h2>
            <div className="space-y-4">
              {CONFLICT_QUESTIONS.map((q, idx) => (
                <div key={q.key} className={s.questionCard}>
                  <p className={s.questionText}>
                    <span className={s.questionNumber}>{idx + 1}.</span>
                    {q.text}
                  </p>
                  <div className={s.radioGroup}>
                    {YES_NO_OPTIONS.map((opt) => (
                      <label key={opt.value} className={s.radioLabel}>
                        <input
                          type="radio"
                          name={q.answerField}
                          checked={formData[q.answerField] === opt.value}
                          onChange={() => handleConflictAnswer(q.answerField, opt.value)}
                          className={s.radio}
                        />
                        <span className={s.radioText}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {formData[q.answerField] === 'yes' && (
                    <textarea
                      value={formData[q.detailsField]}
                      onChange={(e) => handleChange(q.detailsField, e.target.value)}
                      rows={3}
                      className={s.textarea}
                      placeholder={q.detailsPlaceholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              Section 3: Declaration and Signature
             ════════════════════════════════════════════════ */}
          <div>
            <h2 className={s.sectionTitle}>
              <span className={s.sectionNumber}>3</span>
              Declaration and Signature
            </h2>
            <div className={s.consentBox}>
              <label className={s.consentLabel}>
                <input
                  type="checkbox"
                  checked={formData.declarationConfirmed}
                  onChange={(e) => handleChange('declarationConfirmed', e.target.checked)}
                  className={`mt-1 ${s.checkbox}`}
                />
                <span className={s.consentText}>{DECLARATION_TEXT}</span>
              </label>
              <div className="mt-4">
                <label className={s.label}>Signature Date</label>
                <input
                  type="date"
                  value={formData.signatureDate}
                  onChange={(e) => handleChange('signatureDate', e.target.value)}
                  className={`${s.input} max-w-xs`}
                />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              Section 4: Acknowledgment by HR Specialist
             ════════════════════════════════════════════════ */}
          <div>
            <h2 className={s.sectionTitle}>
              <span className={s.sectionNumber}>4</span>
              Acknowledgment by HR Specialist
            </h2>
            <div className={s.reviewSection}>
              <div className={s.grid2}>
                <div>
                  <label className={s.label}>Reviewed By (Name)</label>
                  <input
                    type="text"
                    value={formData.reviewedByName}
                    onChange={(e) => handleChange('reviewedByName', e.target.value)}
                    className={s.input}
                    placeholder="HR Specialist name"
                  />
                </div>

                <div>
                  <label className={s.label}>Position</label>
                  <input
                    type="text"
                    value={formData.reviewedByPosition}
                    onChange={(e) => handleChange('reviewedByPosition', e.target.value)}
                    className={s.input}
                    placeholder="Position / Title"
                  />
                </div>

                <div>
                  <label className={s.label}>Decision</label>
                  <select
                    value={formData.reviewDecision}
                    onChange={(e) => handleChange('reviewDecision', e.target.value)}
                    className={s.select}
                  >
                    <option value="pending">Pending Review</option>
                    {reviewDecisions.map((opt) => (
                      <option key={opt.id} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={s.label}>Review Date</label>
                  <input
                    type="date"
                    value={formData.reviewDate}
                    onChange={(e) => handleChange('reviewDate', e.target.value)}
                    className={s.input}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={s.label}>Comments</label>
                  <textarea
                    value={formData.reviewComments}
                    onChange={(e) => handleChange('reviewComments', e.target.value)}
                    rows={2}
                    className={s.textarea}
                    placeholder="Additional review comments..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              File Upload / Download Section
             ════════════════════════════════════════════════ */}
          <div>
            <h2 className={s.sectionTitle}>Form Attachments</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 -mt-2">
              Upload signed COI form or supporting documents (PDF, Word, images). Max 5MB per file.
            </p>

            <div className={s.fileZone} onClick={triggerFileInput}>
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className={s.fileZoneText}>
                Click to upload or drag and drop
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_FILE_TYPES}
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>

            {fileError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fileError}</p>
            )}

            {formData.uploadedFiles.length > 0 && (
              <div className={s.fileList}>
                {formData.uploadedFiles.map((file) => (
                  <div key={file.id} className={s.fileItem}>
                    <div className="flex items-center min-w-0">
                      <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className={s.fileName}>{file.name}</span>
                      <span className={s.fileSize}>{formatFileSize(file.size)}</span>
                    </div>
                    <div className={s.fileActions}>
                      <button
                        onClick={() => downloadFile(file)}
                        className="text-primary-500 hover:text-primary-600"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-red-500 hover:text-red-600"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════
              Transparency Note
             ════════════════════════════════════════════════ */}
          <div className={s.noteBanner}>
            <div className="flex gap-2">
              <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <p className={s.noteText}>{TRANSPARENCY_NOTE}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default COIForm;
