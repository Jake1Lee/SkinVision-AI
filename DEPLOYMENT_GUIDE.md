# DEPLOYMENT FILES GUIDE

## ESSENTIAL FILES FOR DEPLOYMENT

### Frontend (Next.js)
- `frontend/src/` - All source code
- `frontend/package.json` - Dependencies
- `frontend/next.config.ts` - Next.js configuration
- `frontend/tsconfig.json` - TypeScript configuration
- `frontend/postcss.config.mjs` - PostCSS configuration
- `frontend/eslint.config.mjs` - ESLint configuration
- `frontend/public/` - Static assets

### Backend (Flask)
- `backend/app.py` - Main Flask application
- `backend/models.py` - PyTorch model handling
- `backend/requirements.txt` - Python dependencies
- `backend/models/` - Trained AI models (*.pth files)

### Firebase Configuration
- `firebase.json` - Firebase project configuration
- `firestore.rules` - Firestore security rules
- `storage.rules` - Firebase Storage security rules
- `firestore.indexes.json` - Firestore indexes
- `.firebaserc` - Firebase project settings

### Firebase Functions (if used)
- `functions/package.json` - Cloud Functions dependencies
- `functions/src/` - Cloud Functions source code
- `functions/tsconfig.json` - TypeScript config for functions

### Data Connect (if used)
- `dataconnect/` - Firebase Data Connect configuration

## FILES EXCLUDED FROM DEPLOYMENT (via .gitignore)

### Documentation & Reports
- `pferapport*.txt` - Project reports
- `*.md` (except README.md) - Documentation files
- `analysis_prompt.txt`, `report_prompt.txt` - AI prompts
- `classes.txt` - Development notes

### Test Files
- `test*.py`, `test*.js`, `test*.ts` - Test scripts
- `*.test.*`, `*.spec.*` - Unit tests
- `test.ipynb` - Jupyter notebooks

### Development Files
- `*.bat` - Batch scripts
- `*.log` - Log files
- `.vscode/` - IDE settings
- `__pycache__/` - Python cache
- `node_modules/` - Dependencies (rebuilt on deployment)
- `.next/` - Next.js build cache

### Data Files
- `*.xlsx`, `*.csv` - Data files
- `backend/uploads/` - Temporary uploaded files
- `backend/results/` - Training results and visualizations

### Firebase Development
- `firestore-rules.txt` - Backup rules
- `firestore-permissive.rules` - Development rules
- `storage-rules.txt` - Backup storage rules

### Environment Files
- `.env*` - Environment variables (should be configured on hosting platform)

## DEPLOYMENT CHECKLIST

✅ Source code files included
✅ Configuration files included  
✅ AI models included
✅ Firebase rules included
✅ Dependencies defined in package.json/requirements.txt
✅ Development files excluded
✅ Test files excluded
✅ Logs and cache excluded
✅ Environment variables configured separately on host
✅ Documentation excluded (unless needed)

## ESTIMATED DEPLOYMENT SIZE
- Frontend: ~50-100MB (with node_modules)
- Backend: ~200-500MB (with AI models)
- Total: ~250-600MB (excluding development files)

Without .gitignore exclusions, the project would be 2-3x larger due to:
- Development documentation
- Test files and data
- Cache files
- IDE configurations
- Temporary files
