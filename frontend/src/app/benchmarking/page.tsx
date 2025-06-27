'use client';

import React from 'react';
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
                <span>50.2%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Precision:</span>
                <span>63.4%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Recall:</span>
                <span>50.5%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>F1 Score:</span>
                <span>51.2%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Training Epochs:</span>
                <span>250</span>
              </div>
            </div>
            
            <div className={styles.imageWithInfo}>
              <div className={styles.staticImage}>
                <img 
                  src="/images/resnet50_confusion_matrix.png" 
                  alt="ResNet50 Confusion Matrix"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.infoIcon}>
                <FaInfoCircle />
                <span className={styles.tooltip}>
                  The confusion matrix shows the performance of the ResNet50 model across all 40 skin lesion classes.
                  The diagonal elements represent the number of correctly classified instances for each class, 
                  while off-diagonal elements represent misclassifications.
                </span>
              </div>
            </div>
            
            <div className={styles.strengths}>
              <h4 className={styles.listTitle}>Strengths</h4>
              <ul className={styles.list}>
                <li>Higher overall accuracy compared to InceptionV3</li>
                <li>Better performance on common skin lesion types (jb, jd, cb)</li>
                <li>More stable training with less fluctuation in validation metrics</li>
                <li>Strong precision on melanoma detection (mel class)</li>
                <li>Good performance on basal cell carcinoma (bcc)</li>
              </ul>
            </div>
            
            <div className={styles.weaknesses}>
              <h4 className={styles.listTitle}>Weaknesses</h4>
              <li>Struggles with rare classes (dfsp, ks, lmm)</li>
              <li>Confusion between similar-looking lesion types</li>
              <li>Overfitting tendency after ~150 epochs</li>
              <li>Lower recall on some malignant classes</li>
              <li>Performance plateaus in later training epochs</li>
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
                <span>45.1%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Precision:</span>
                <span>29.1%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Recall:</span>
                <span>45.1%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>F1 Score:</span>
                <span>29.7%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Training Epochs:</span>
                <span>2</span>
              </div>
            </div>
            
            <div className={styles.imageWithInfo}>
              <div className={styles.staticImage}>
                <img 
                  src="/images/inceptionv3_confusion_matrix.png" 
                  alt="InceptionV3 Confusion Matrix"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className={styles.infoIcon}>
                <FaInfoCircle />
                <span className={styles.tooltip}>
                  The confusion matrix shows the performance of the InceptionV3 model across all 40 skin lesion classes.
                  The diagonal elements represent the number of correctly classified instances for each class, 
                  while off-diagonal elements represent misclassifications. Note that this model was only trained for 2 epochs,
                  which explains its lower performance compared to ResNet50.
                </span>
              </div>
            </div>
            
            <div className={styles.strengths}>
              <h4 className={styles.listTitle}>Strengths</h4>
              <ul className={styles.list}>
                <li>Better performance on some rare lesion types</li>
                <li>Faster initial learning rate</li>
                <li>Good at distinguishing certain visually distinct classes</li>
                <li>Shows potential for improvement with more training</li>
                <li>Less prone to overfitting in early epochs</li>
              </ul>
            </div>
            
            <div className={styles.weaknesses}>
              <h4 className={styles.listTitle}>Weaknesses</h4>
              <ul className={styles.list}>
                <li>Lower overall accuracy compared to ResNet50</li>
                <li>Significantly undertrained (only 2 epochs)</li>
                <li>Poor precision across most classes</li>
                <li>High confusion between similar classes</li>
                <li>Inconsistent performance across different lesion types</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Training Metrics Analysis</h2>
        
        <GlassCard>
          <h3 className={styles.cardTitle}>ResNet50 Training</h3>
          <p>
            The ResNet50 model was trained for 250 epochs with a batch size of 32. The training shows a steady 
            improvement in accuracy, precision, and recall over time. The validation loss stabilizes around epoch 100, 
            indicating good generalization. The final model achieves 50.2% accuracy on the test set, which is 
            reasonable given the challenging nature of the 40-class skin lesion classification task.
          </p>
          
          <div className={styles.imageWithInfo}>
            <div className={styles.staticImage}>
              <img 
                src="/images/resnet50_training_metrics.png" 
                alt="ResNet50 Training Metrics"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className={styles.infoIcon}>
              <FaInfoCircle />
              <span className={styles.tooltip}>
                The training metrics show the model's performance over 250 epochs. The graphs display accuracy, 
                precision, recall, and F1 score metrics, as well as training and validation loss.
              </span>
            </div>
          </div>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricBox}>
              <h4>Final Accuracy</h4>
              <div className={styles.metricValue}>50.2%</div>
            </div>
            <div className={styles.metricBox}>
              <h4>Final Precision</h4>
              <div className={styles.metricValue}>63.4%</div>
            </div>
            <div className={styles.metricBox}>
              <h4>Final Recall</h4>
              <div className={styles.metricValue}>50.5%</div>
            </div>
            <div className={styles.metricBox}>
              <h4>Final F1 Score</h4>
              <div className={styles.metricValue}>51.2%</div>
            </div>
          </div>
          
          <p>
            The learning rate schedule shows a gradual decrease over time, which helps the model converge to a better 
            solution. The F1 score, which balances precision and recall, reaches around 51.2% by the end of training.
          </p>
        </GlassCard>
        
        <GlassCard>
          <h3 className={styles.cardTitle}>InceptionV3 Training</h3>
          <p>
            The InceptionV3 model was only trained for 2 epochs, which is insufficient for optimal performance. 
            Despite this limitation, the model shows promising initial results with a validation accuracy of 45.1%. 
            The training and validation loss curves indicate that the model was still improving when training was stopped.
          </p>
          
          <div className={styles.imageWithInfo}>
            <div className={styles.staticImage}>
              <img 
                src="/images/inceptionv3_training_metrics.png" 
                alt="InceptionV3 Training Metrics"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className={styles.infoIcon}>
              <FaInfoCircle />
              <span className={styles.tooltip}>
                The training metrics show the model's performance over just 2 epochs. Despite the limited training,
                the graphs show promising trends in accuracy, precision, recall, and F1 score metrics.
              </span>
            </div>
          </div>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricBox}>
              <h4>Final Recall</h4>
              <div className={styles.metricValue}>45.1%</div>
            </div>
            <div className={styles.metricBox}>
              <h4>Final F1 Score</h4>
              <div className={styles.metricValue}>29.7%</div>
            </div>
          </div>
          
          <div className={styles.noteBox}>
            <strong>Note:</strong> The InceptionV3 model was only trained for 2 epochs, which is insufficient for optimal performance.
            With more training, this model could potentially match or exceed the performance of ResNet50.
          </div>
          
          <p>
            The precision, recall, and F1 score metrics all show an upward trend, suggesting that with more training, 
            this model could potentially match or exceed the performance of ResNet50. The learning rate was maintained 
            at a constant value during the brief training period.
          </p>
        </GlassCard>
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
            InceptionV3 model was significantly undertrained with only 2 epochs compared to ResNet50's 250 epochs.
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
