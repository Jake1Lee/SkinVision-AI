'use client';

import React from 'react';
import Image from 'next/image';
import styles from './Benchmarking.module.css';
import GlassCard from '@/components/GlassCard';
import { FaInfoCircle } from 'react-icons/fa';

const BenchmarkingPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Model Benchmarking</h1>
        <p className={styles.subtitle}>
          Comprehensive performance analysis of our skin lesion classification models: ResNet50 and InceptionV3.
          This page provides insights into model accuracy, strengths, weaknesses, and potential improvements.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Model Performance Overview</h2>
        <div className={styles.modelComparison}>
          {/* ResNet50 Card */}
          <div className={styles.modelCard}>
            <div className={styles.modelHeader}>
              <h3 className={styles.modelName}>ResNet50</h3>
            </div>
            
            <div className={styles.modelMetrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Accuracy:</span>
                <span>87.62%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Precision (Weighted):</span>
                <span>87.39%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Recall (Weighted):</span>
                <span>87.62%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>F1 Score (Weighted):</span>
                <span>86.97%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Top-3 Accuracy:</span>
                <span>99.14%</span>
              </div>
            </div>
            
            <div className={styles.imageWithInfo}>
              <div className={styles.staticImage}>
                <Image 
                  src="/new_data/tosend/resnet50_new_info/ResNet50 - Test Set Confusion Matrix.png" 
                  alt="ResNet50 Confusion Matrix"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.infoIcon}>
                <FaInfoCircle />
                <span className={styles.tooltip}>
                  The confusion matrix shows the performance of the ResNet50 model across all 40 skin lesion classes.
                  The diagonal elements represent the number of correctly classified instances for each class, 
                  while off-diagonal elements represent misclassifications. The model achieves excellent performance with 87.62% accuracy.
                </span>
              </div>
            </div>
            
            <p className={styles.analysisText}>
              The confusion matrix visualization reveals ResNet50's impressive classification capabilities across the 40 different skin lesion types. 
              The strong diagonal pattern indicates that the model correctly identifies most lesions, with particularly excellent performance on common 
              classes like melanocytic nevi (nv) and seborrheic keratoses (bkl). The matrix shows minimal off-diagonal scatter, suggesting that 
              misclassifications are relatively rare and often between visually similar lesion types. This high-quality performance makes ResNet50 
              a reliable choice for clinical skin lesion analysis, with the caveat that rare lesion types with very few training samples still 
              pose challenges for accurate classification.
            </p>
            
            <div className={styles.strengths}>
              <h4 className={styles.listTitle}>Strengths</h4>
              <ul className={styles.list}>
                <li>Excellent overall accuracy (87.62%) and precision (87.39%)</li>
                <li>Outstanding Top-3 accuracy (99.14%) and Top-5 accuracy (99.78%)</li>
                <li>Perfect performance on some classes (isl, ha, alm, anm, angk)</li>
                <li>Strong melanoma (mel) detection with 93.33% F1-score</li>
                <li>Excellent basal cell carcinoma (bcc) detection with 96.98% F1-score</li>
                <li>High confidence in predictions (average 87.13%)</li>
              </ul>
            </div>
            
            <div className={styles.weaknesses}>
              <h4 className={styles.listTitle}>Weaknesses</h4>
              <ul className={styles.list}>
                <li>Zero performance on very rare classes (dfsp, lk, pg)</li>
                <li>Poor performance on seborrheic keratosis (jb) with 63.94% F1-score</li>
                <li>Struggles with classes having very few samples (≤5 samples)</li>
                <li>Some confusion between visually similar lesion types</li>
                <li>Class imbalance issues affecting rare lesion detection</li>
              </ul>
            </div>
          </div>
          
          {/* InceptionV3 Card */}
          <div className={styles.modelCard}>
            <div className={styles.modelHeader}>
              <h3 className={styles.modelName}>InceptionV3</h3>
            </div>
            
            <div className={styles.modelMetrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Accuracy:</span>
                <span>43.64%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Precision (Weighted):</span>
                <span>29.29%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Recall (Weighted):</span>
                <span>43.64%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>F1 Score (Weighted):</span>
                <span>27.55%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Top-3 Accuracy:</span>
                <span>63.58%</span>
              </div>
            </div>
            
            <div className={styles.imageWithInfo}>
              <div className={styles.staticImage}>
                <Image 
                  src="/new_data/tosend/InceptionV3_new_info/InceptionV3 - Test Set Confusion Matrix.png" 
                  alt="InceptionV3 Confusion Matrix"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.infoIcon}>
                <FaInfoCircle />
                <span className={styles.tooltip}>
                  The confusion matrix shows the performance of the InceptionV3 model across all 40 skin lesion classes.
                  The model shows poor overall performance (43.64% accuracy) with significant struggles in class recognition.
                  Most predictions are concentrated on a few dominant classes, indicating severe overfitting to common lesions.
                </span>
              </div>
            </div>
            
            <p className={styles.analysisText}>
              The InceptionV3 confusion matrix tells a concerning story of undertraining and poor generalization. Unlike ResNet50's clean diagonal 
              pattern, this matrix shows heavy concentration along just a few rows, indicating that the model has learned to predict only a small 
              subset of the 40 classes. The sparse diagonal and dense horizontal lines suggest the model is defaulting to predicting the most 
              common classes regardless of the actual input. This behavior is characteristic of insufficient training time (only 2 epochs compared 
              to ResNet50's 250) and highlights the critical importance of adequate training duration for complex multi-class classification tasks 
              in medical imaging.
            </p>
            
            <div className={styles.strengths}>
              <h4 className={styles.listTitle}>Strengths</h4>
              <ul className={styles.list}>
                <li>Good performance on the dominant class (jd) with 61.29% F1-score</li>
                <li>Reasonable precision for classes it does predict correctly</li>
                <li>Lower computational requirements during training</li>
                <li>Faster inference time compared to ResNet50</li>
                <li>Less prone to overfitting on small datasets</li>
              </ul>
            </div>
            
            <div className={styles.weaknesses}>
              <h4 className={styles.listTitle}>Weaknesses</h4>
              <ul className={styles.list}>
                <li>Very poor overall accuracy (43.64%) compared to ResNet50</li>
                <li>Zero performance on 36 out of 40 classes</li>
                <li>Severe class imbalance handling issues</li>
                <li>Low confidence predictions (average 27.31%)</li>
                <li>Poor generalization across different lesion types</li>
                <li>Inadequate training or model architecture issues</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Detailed Performance Analysis</h2>
        
        <GlassCard>
          <h3 className={styles.cardTitle}>ResNet50 - Comprehensive Analysis</h3>
          <p>
            The ResNet50 model demonstrates excellent performance with 87.62% accuracy on the 40-class skin lesion 
            classification task. The model shows strong precision (87.39%) and recall (87.62%), with an outstanding 
            Top-3 accuracy of 99.14% and Top-5 accuracy of 99.78%. The high confidence scores (average 87.13%) 
            indicate reliable predictions.
          </p>
          
          <div className={styles.imageWithInfo}>
            <div className={styles.staticImage}>
              <Image 
                src="/new_data/tosend/resnet50_new_info/Resnet50 - Global Performance Metrics.png" 
                alt="ResNet50 Global Performance Metrics"
                width={800}
                height={600}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className={styles.infoIcon}>
              <FaInfoCircle />
              <span className={styles.tooltip}>
                Global performance metrics showing the ResNet50 model&apos;s excellent overall performance across 
                all evaluation criteria including accuracy, precision, recall, and F1-score.
              </span>
            </div>
          </div>
          
          <p className={styles.analysisText}>
            The global performance metrics chart demonstrates ResNet50's exceptional balance across all key evaluation criteria. With values 
            consistently above 86% for accuracy, precision, recall, and F1-score, the model shows remarkable consistency that is crucial for 
            medical applications. The tight clustering of these metrics around 87% indicates that the model doesn't sacrifice one metric for 
            another - it maintains high precision (minimizing false positives) while achieving high recall (catching most true cases). This 
            balanced performance is particularly important in dermatological applications where both missed diagnoses and false alarms can 
            have significant clinical consequences. The Top-3 and Top-5 accuracy metrics (99.14% and 99.78% respectively) provide additional 
            confidence that even when the top prediction is incorrect, the correct diagnosis is very likely to be among the top candidates.
          </p>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricBox}>
              <h4>Global Accuracy</h4>
              <div className={styles.metricValue}>87.62%</div>
            </div>
            <div className={styles.metricBox}>
              <h4>Weighted Precision</h4>
              <div className={styles.metricValue}>87.39%</div>
            </div>
            <div className={styles.metricBox}>
              <h4>Weighted Recall</h4>
              <div className={styles.metricValue}>87.62%</div>
            </div>
            <div className={styles.metricBox}>
              <h4>Weighted F1-Score</h4>
              <div className={styles.metricValue}>86.97%</div>
            </div>
          </div>
          
          <div className={styles.imageWithInfo}>
            <div className={styles.staticImage}>
              <Image 
                src="/new_data/tosend/resnet50_new_info/Resnet50 - F1-Score by Class (Sorted by Performance).png" 
                alt="ResNet50 F1-Score by Class"
                width={800}
                height={600}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className={styles.infoIcon}>
              <FaInfoCircle />
              <span className={styles.tooltip}>
                F1-Score performance for each of the 40 skin lesion classes, sorted by performance. 
                Shows excellent performance on most classes with perfect scores on several rare lesions.
              </span>
            </div>
          </div>
          
          <p className={styles.analysisText}>
            This class-wise F1-score analysis reveals fascinating insights into ResNet50's learning patterns. The chart shows that approximately 
            two-thirds of the 40 classes achieve F1-scores above 0.8, with several classes reaching perfect 1.0 scores. Interestingly, some of 
            the highest-performing classes are actually rare lesion types, suggesting that when these classes have sufficient distinctive features, 
            the model can learn them exceptionally well despite limited samples. The gradual decline rather than a sharp drop-off indicates robust 
            learning across the spectrum of lesion types. The classes with lower F1-scores typically correspond to either extremely rare conditions 
            with insufficient training data or lesions that are visually similar to other types, creating inherent classification challenges that 
            even experienced dermatologists face.
          </p>
        </GlassCard>
        
        <GlassCard>
          <h3 className={styles.cardTitle}>InceptionV3 - Performance Assessment</h3>
          <p>
            The InceptionV3 model shows significantly lower performance with 43.64% accuracy. The model struggles 
            with class recognition, achieving zero performance on 36 out of 40 classes. This indicates severe 
            training issues or architectural limitations for this specific task. The average confidence is only 
            27.31%, suggesting uncertain predictions.
          </p>
          
          <div className={styles.imageWithInfo}>
            <div className={styles.staticImage}>
              <Image 
                src="/new_data/tosend/InceptionV3_new_info/InceptionV3 - Global Performance Metrics.png" 
                alt="InceptionV3 Global Performance Metrics"
                width={800}
                height={600}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className={styles.infoIcon}>
              <FaInfoCircle />
              <span className={styles.tooltip}>
                Global performance metrics for InceptionV3 showing poor overall performance, indicating 
                the need for significant model improvements or retraining.
              </span>
            </div>
          </div>
          
          <p className={styles.analysisText}>
            The InceptionV3 global performance metrics paint a stark contrast to ResNet50's excellence, with all key metrics falling well below 
            acceptable levels for medical applications. The dramatic gap between accuracy (43.64%) and precision (29.29%) indicates severe class 
            imbalance handling issues, where the model's predictions are not only often wrong but also heavily biased toward common classes. 
            The low F1-score (27.55%) reflects the compound effect of poor precision and recall, suggesting fundamental learning failures rather 
            than simple overfitting. These metrics collectively indicate that the InceptionV3 model requires substantial retraining with proper 
            hyperparameter tuning, longer training duration, and potentially architectural modifications to achieve clinical utility.
          </p>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricBox}>
              <h4>Global Accuracy</h4>
              <div className={styles.metricValue}>43.64%</div>
            </div>
            <div className={styles.metricBox}>
              <h4>Weighted Precision</h4>
              <div className={styles.metricValue}>29.29%</div>
            </div>
            <div className={styles.metricBox}>
              <h4>Weighted Recall</h4>
              <div className={styles.metricValue}>43.64%</div>
            </div>
            <div className={styles.metricBox}>
              <h4>Weighted F1-Score</h4>
              <div className={styles.metricValue}>27.55%</div>
            </div>
          </div>
          
          <div className={styles.imageWithInfo}>
            <div className={styles.staticImage}>
              <Image 
                src="/new_data/tosend/InceptionV3_new_info/InceptionV3 - F1-Score by Class (Sorted by Performance).png" 
                alt="InceptionV3 F1-Score by Class"
                width={800}
                height={600}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className={styles.infoIcon}>
              <FaInfoCircle />
              <span className={styles.tooltip}>
                F1-Score performance showing the InceptionV3 model&apos;s poor performance across most classes, 
                with only one class (jd) showing reasonable performance.
              </span>
            </div>
          </div>
          
          <p className={styles.analysisText}>
            The InceptionV3 F1-score distribution reveals a catastrophic failure in multi-class learning, with 36 out of 40 classes achieving 
            zero F1-scores. This extreme imbalance indicates that the model has essentially collapsed into a binary classifier, predicting only 
            a few dominant classes while completely ignoring the vast majority of lesion types. The single class showing reasonable performance 
            (jd with 61.29% F1-score) likely represents the most frequent class in the training set, suggesting the model learned to simply 
            predict the majority class regardless of input features. This pattern is a classic symptom of severe undertraining and highlights 
            the critical importance of sufficient epochs and proper regularization in medical AI applications.
          </p>
        </GlassCard>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Class Distribution and Performance Correlation</h2>
        
        <div className={styles.modelComparison}>
          <div className={styles.modelCard}>
            <h3 className={styles.cardTitle}>ResNet50 - Class Analysis</h3>
            
            <div className={styles.imageWithInfo}>
              <div className={styles.staticImage}>
                <Image 
                  src="/new_data/tosend/resnet50_new_info/Class Distribution by Number of Test Samples - Resnet50.png" 
                  alt="ResNet50 Class Distribution"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.infoIcon}>
                <FaInfoCircle />
                <span className={styles.tooltip}>
                  Distribution of test samples across the 40 skin lesion classes, showing significant class imbalance 
                  with some classes having thousands of samples while others have very few.
                </span>
              </div>
            </div>
            
            <p className={styles.analysisText}>
              The class distribution chart reveals the challenging reality of medical datasets - extreme imbalance that mirrors real-world 
              prevalence of different skin conditions. Common benign lesions like melanocytic nevi and seborrheic keratoses dominate the 
              dataset with thousands of samples, while rare malignant conditions may have fewer than 50 examples. This distribution pattern 
              is both realistic (reflecting actual clinical prevalence) and problematic for machine learning, as models naturally bias toward 
              frequent classes. The long tail of rare classes represents the most critical diagnostic challenges where accurate AI assistance 
              could provide the greatest clinical value, yet these are precisely the cases where the model has the least training data to 
              learn from.
            </p>
            
            <div className={styles.imageWithInfo}>
              <div className={styles.staticImage}>
                <Image 
                  src="/new_data/tosend/resnet50_new_info/Resnet50 - Relationship between Test Sample Count and Performance (F1-Score).png" 
                  alt="ResNet50 Sample Count vs Performance"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.infoIcon}>
                <FaInfoCircle />
                <span className={styles.tooltip}>
                  Relationship between the number of test samples and F1-Score performance, showing how class 
                  imbalance affects model performance on different lesion types.
                </span>
              </div>
            </div>
            
            <p className={styles.analysisText}>
              This scatter plot reveals a complex relationship between sample count and performance that defies simple correlation. While there's 
              a general trend of better performance with more samples, notable exceptions exist where rare classes achieve perfect or near-perfect 
              F1-scores. This suggests that sample count alone doesn't determine classification success - the distinctiveness of visual features 
              plays a crucial role. Some rare lesions may have unique characteristics that make them easily separable, while common lesions with 
              high visual variability may prove more challenging despite abundant training data. The presence of high-performing rare classes 
              offers hope that with careful data curation and feature engineering, even uncommon conditions can be accurately diagnosed by AI systems.
            </p>
          </div>
          
          <div className={styles.modelCard}>
            <h3 className={styles.cardTitle}>InceptionV3 - Class Analysis</h3>
            
            <div className={styles.imageWithInfo}>
              <div className={styles.staticImage}>
                <Image 
                  src="/new_data/tosend/InceptionV3_new_info/Class Distribution by Number of Test Samples - InceptionV3.png" 
                  alt="InceptionV3 Class Distribution"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.infoIcon}>
                <FaInfoCircle />
                <span className={styles.tooltip}>
                  Same class distribution as ResNet50, showing the challenging nature of the dataset with 
                  significant class imbalance affecting both models.
                </span>
              </div>
            </div>
            
            <div className={styles.imageWithInfo}>
              <div className={styles.staticImage}>
                <Image 
                  src="/new_data/tosend/InceptionV3_new_info/InceptionV3 - Relationship between Test Sample Count and Performance (F1-Score).png" 
                  alt="InceptionV3 Sample Count vs Performance"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.infoIcon}>
                <FaInfoCircle />
                <span className={styles.tooltip}>
                  Shows how InceptionV3 fails to handle class imbalance effectively, with poor performance 
                  across all classes regardless of sample count.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Precision vs Recall Analysis</h2>
        
        <div className={styles.modelComparison}>
          <div className={styles.modelCard}>
            <h3 className={styles.cardTitle}>ResNet50 - Precision vs Recall</h3>
            
            <div className={styles.imageWithInfo}>
              <div className={styles.staticImage}>
                <Image 
                  src="/new_data/tosend/resnet50_new_info/Resnet50 - Precision vs Recall by Class.png" 
                  alt="ResNet50 Precision vs Recall"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.infoIcon}>
                <FaInfoCircle />
                <span className={styles.tooltip}>
                  Precision vs Recall scatter plot showing the trade-off between these metrics for each class. 
                  Most classes cluster in the high-precision, high-recall region indicating balanced performance.
                </span>
              </div>
            </div>
            
            <p className={styles.analysisText}>
              The precision-recall scatter plot for ResNet50 demonstrates exceptional balance, with most classes clustering in the upper-right 
              quadrant representing high precision and high recall simultaneously. This is particularly impressive for medical classification, 
              where the typical precision-recall trade-off can force difficult choices between missing cases (low recall) and false alarms 
              (low precision). The tight clustering around the (0.8, 0.8) to (1.0, 1.0) region indicates that ResNet50 has learned to be 
              both conservative (avoiding false positives) and sensitive (catching true positives) across most lesion types. The few outliers 
              with lower precision or recall likely correspond to the most challenging classes with inherent visual ambiguity or insufficient 
              training data.
            </p>
          </div>
          
          <div className={styles.modelCard}>
            <h3 className={styles.cardTitle}>InceptionV3 - Precision vs Recall</h3>
            
            <div className={styles.imageWithInfo}>
              <div className={styles.staticImage}>
                <Image 
                  src="/new_data/tosend/InceptionV3_new_info/InceptionV3 - Precision vs Recall by Class.png" 
                  alt="InceptionV3 Precision vs Recall"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.infoIcon}>
                <FaInfoCircle />
                <span className={styles.tooltip}>
                  Shows the poor precision-recall trade-off for InceptionV3, with most classes clustered 
                  at the origin indicating zero or near-zero performance.
                </span>
              </div>
            </div>
            
            <p className={styles.analysisText}>
              The InceptionV3 precision-recall plot starkly illustrates the model's failure to achieve meaningful performance across the class 
              spectrum. With most points clustered at the origin (0,0), the visualization shows that the vast majority of classes achieve 
              neither precision nor recall, indicating complete classification failure for these lesion types. The few scattered points away 
              from the origin represent the limited classes where the model shows some learning, but even these fall far short of clinically 
              useful performance levels. This distribution pattern is characteristic of severe undertraining and suggests that the model has 
              not learned the fundamental visual features necessary for distinguishing between different skin lesion types.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Confidence Score Analysis</h2>
        
        <div className={styles.modelComparison}>
          <div className={styles.modelCard}>
            <h3 className={styles.cardTitle}>ResNet50 - Confidence Scores</h3>
            
            <div className={styles.imageWithInfo}>
              <div className={styles.staticImage}>
                <Image 
                  src="/new_data/tosend/resnet50_new_info/confidence scores - resnet50.png" 
                  alt="ResNet50 Confidence Scores"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.infoIcon}>
                <FaInfoCircle />
                <span className={styles.tooltip}>
                  Distribution of confidence scores showing that ResNet50 makes high-confidence predictions 
                  (average 87.13%), indicating reliable and certain classifications.
                </span>
              </div>
            </div>
            
            <p className={styles.analysisText}>
              The confidence score distribution for ResNet50 reveals a model that "knows what it knows" - a critical characteristic for medical 
              AI systems. The heavily right-skewed distribution with most predictions above 0.8 confidence indicates that the model makes 
              decisive, high-confidence predictions rather than uncertain guesses. This pattern is particularly valuable in clinical settings 
              where healthcare providers need to trust AI recommendations. The clear separation between correct and incorrect prediction 
              confidence levels (90.02% vs 66.69% average) suggests that the confidence scores can serve as a reliable indicator of prediction 
              quality, enabling clinicians to appropriately weight AI suggestions based on the model's own uncertainty assessment.
            </p>
            
            <p>
              <strong>Confidence Statistics:</strong> Average confidence of 87.13% with only 3.1% of predictions 
              having low confidence (&lt; 0.5). Correct predictions have higher average confidence (90.02%) 
              compared to incorrect ones (66.69%).
            </p>
          </div>
          
          <div className={styles.modelCard}>
            <h3 className={styles.cardTitle}>InceptionV3 - Confidence Scores</h3>
            
            <div className={styles.imageWithInfo}>
              <div className={styles.staticImage}>
                <Image 
                  src="/new_data/tosend/InceptionV3_new_info/confidence scores - InceptionV3.png" 
                  alt="InceptionV3 Confidence Scores"
                  width={800}
                  height={600}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.infoIcon}>
                <FaInfoCircle />
                <span className={styles.tooltip}>
                  Shows the poor confidence distribution for InceptionV3 with low average confidence (27.31%), 
                  indicating uncertain and unreliable predictions.
                </span>
              </div>
            </div>
            
            <p className={styles.analysisText}>
              The InceptionV3 confidence score distribution reveals a model plagued by uncertainty and poor calibration. The heavily left-skewed 
              distribution with most predictions below 0.5 confidence indicates that the model is essentially guessing rather than making 
              informed classifications. This low-confidence pattern is particularly concerning for medical applications, as it suggests the 
              model cannot reliably distinguish between different lesion types. The fact that 89.6% of predictions have low confidence reflects 
              fundamental learning deficiencies that would make this model unsuitable for clinical deployment without substantial retraining. 
              The poor confidence calibration also means that even when the model does make correct predictions, it often lacks the confidence 
              to support clinical decision-making.
            </p>
            
            <p>
              <strong>Confidence Statistics:</strong> Low average confidence of 27.31% with 89.6% of predictions 
              having low confidence (&lt; 0.5). This indicates the model is highly uncertain about its predictions.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Model Architecture & Configuration</h2>
        
        <div className={styles.modelComparison}>
          <div className={styles.modelCard}>
            <h3 className={styles.cardTitle}>ResNet50 Configuration</h3>
            <table className={styles.configTable}>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Architecture</td>
                  <td>ResNet50 with custom FC layers</td>
                </tr>
                <tr>
                  <td>Pretrained</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Number of Classes</td>
                  <td>40</td>
                </tr>
                <tr>
                  <td>Dropout Rate</td>
                  <td>0.5</td>
                </tr>
                <tr>
                  <td>Image Size</td>
                  <td>224 × 224</td>
                </tr>
                <tr>
                  <td>Batch Size</td>
                  <td>32</td>
                </tr>
                <tr>
                  <td>Learning Rate</td>
                  <td>0.001</td>
                </tr>
                <tr>
                  <td>Optimizer</td>
                  <td>AdamW</td>
                </tr>
                <tr>
                  <td>Scheduler</td>
                  <td>Cosine Annealing</td>
                </tr>
                <tr>
                  <td>Weight Decay</td>
                  <td>0.0001</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className={styles.modelCard}>
            <h3 className={styles.cardTitle}>InceptionV3 Configuration</h3>
            <table className={styles.configTable}>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Architecture</td>
                  <td>InceptionV3 with custom FC layer</td>
                </tr>
                <tr>
                  <td>Pretrained</td>
                  <td>Yes (assumed)</td>
                </tr>
                <tr>
                  <td>Number of Classes</td>
                  <td>40</td>
                </tr>
                <tr>
                  <td>Dropout Rate</td>
                  <td>Not specified</td>
                </tr>
                <tr>
                  <td>Image Size</td>
                  <td>299 × 299 (standard for InceptionV3)</td>
                </tr>
                <tr>
                  <td>Batch Size</td>
                  <td>Not specified</td>
                </tr>
                <tr>
                  <td>Learning Rate</td>
                  <td>Not specified</td>
                </tr>
                <tr>
                  <td>Optimizer</td>
                  <td>Not specified</td>
                </tr>
                <tr>
                  <td>Scheduler</td>
                  <td>Not specified</td>
                </tr>
                <tr>
                  <td>Weight Decay</td>
                  <td>Not specified</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Potential Improvements</h2>
        
        <GlassCard>
          <div className={styles.improvements}>
            <h3 className={styles.cardTitle}>ResNet50 Improvements</h3>
            <ul className={styles.list}>
              <li>Implement more aggressive data augmentation to improve generalization</li>
              <li>Use focal loss to address class imbalance issues</li>
              <li>Experiment with different learning rate schedules</li>
              <li>Implement ensemble methods with other model architectures</li>
              <li>Fine-tune the model with a smaller learning rate after initial convergence</li>
              <li>Explore transfer learning from larger datasets</li>
            </ul>
          </div>
        </GlassCard>
        
        <GlassCard>
          <div className={styles.improvements}>
            <h3 className={styles.cardTitle}>InceptionV3 Improvements</h3>
            <ul className={styles.list}>
              <li>Continue training for more epochs (at least 100-200)</li>
              <li>Implement proper learning rate scheduling</li>
              <li>Use class weights to address imbalance (similar to ResNet50)</li>
              <li>Experiment with different optimizers (AdamW, SGD with momentum)</li>
              <li>Apply regularization techniques to prevent overfitting</li>
              <li>Consider using a hybrid approach combining features from both models</li>
            </ul>
          </div>
        </GlassCard>
      </section>      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Conclusion</h2>
        
        <GlassCard>
          <p>
            Based on our benchmarking analysis, ResNet50 currently outperforms InceptionV3 for skin lesion classification, 
            achieving higher accuracy, precision, and F1 scores. However, this comparison is not entirely fair as the 
            InceptionV3 model was significantly undertrained with only 2 epochs compared to ResNet50&apos;s 250 epochs.
          </p>
          <p>
            Both models show strengths and weaknesses in classifying different types of skin lesions. ResNet50 performs 
            better on common lesion types, while InceptionV3 shows potential for rare classes. The confusion matrices 
            reveal that both models struggle with similar-looking lesion types, which is expected given the visual 
            similarity between many skin conditions.
          </p>
          <p>
            For future development, we recommend:
          </p>
          <ol>
            <li>Continuing the training of InceptionV3 to its full potential</li>
            <li>Implementing an ensemble approach that leverages the strengths of both models</li>
            <li>Focusing on improving performance on clinically important classes (melanoma, basal cell carcinoma)</li>
            <li>Collecting more training data for underrepresented classes</li>
            <li>Exploring more advanced architectures like EfficientNet or Vision Transformers</li>
          </ol>
        </GlassCard>
      </section>
    </div>
  );
};

export default BenchmarkingPage;
