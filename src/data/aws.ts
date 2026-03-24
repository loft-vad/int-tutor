import type { Question } from '@/types/content';

export const awsQuestions: Question[] = [
  // --- IAM ---
  {
    id: 'aws-001',
    type: 'flashcard',
    topic: 'aws',
    difficulty: 'beginner',
    tags: ['iam', 'security'],
    front: 'What is the principle of least privilege in AWS IAM?',
    back: 'Grant only the minimum permissions required for a user, role, or service to perform its intended function. Never grant broader access than necessary.',
    explanation:
      'Least privilege is a core security best practice in AWS. IAM policies should be scoped to specific actions and resources. Use IAM Access Analyzer and policy simulation to verify that policies do not grant excessive permissions.',
    createdAt: '2024-01-01',
  },
  {
    id: 'aws-002',
    type: 'multiple-choice',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['iam', 'security'],
    prompt: 'Which IAM entity should you use to grant an EC2 instance access to S3?',
    options: [
      { id: 'a', text: 'IAM user with access keys stored on the instance' },
      { id: 'b', text: 'IAM role attached to the EC2 instance via an instance profile' },
      { id: 'c', text: 'IAM group with an S3 policy' },
      { id: 'd', text: 'Root account credentials' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation:
      'IAM roles with instance profiles are the recommended way to grant AWS service permissions to EC2 instances. This avoids storing long-lived credentials on the instance. The instance receives temporary credentials via the instance metadata service that are automatically rotated.',
    createdAt: '2024-01-01',
  },

  // --- EC2 ---
  {
    id: 'aws-003',
    type: 'flashcard',
    topic: 'aws',
    difficulty: 'beginner',
    tags: ['ec2', 'compute'],
    front: 'What is an AMI (Amazon Machine Image)?',
    back: 'A pre-configured template containing the OS, application server, and applications needed to launch an EC2 instance. AMIs can be public, private, or shared, and are region-specific (but can be copied across regions).',
    explanation:
      'AMIs enable repeatable, consistent instance launches. You can create custom AMIs from running instances to capture your configuration. Golden AMIs are a best practice for reducing instance boot time and ensuring consistency.',
    createdAt: '2024-01-01',
  },
  {
    id: 'aws-004',
    type: 'multiple-choice',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['ec2', 'auto-scaling'],
    prompt: 'What is the difference between horizontal and vertical scaling on AWS?',
    options: [
      { id: 'a', text: 'Horizontal scaling increases instance size; vertical scaling adds more instances' },
      { id: 'b', text: 'Horizontal scaling adds more instances; vertical scaling increases instance size' },
      { id: 'c', text: 'Both refer to adding more instances but in different Availability Zones' },
      { id: 'd', text: 'Horizontal scaling is for databases only; vertical scaling is for compute' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation:
      'Horizontal scaling (scaling out) adds more instances behind a load balancer, providing better fault tolerance. Vertical scaling (scaling up) moves to a larger instance type, which has hardware limits. Auto Scaling Groups handle horizontal scaling automatically based on metrics like CPU utilization.',
    createdAt: '2024-01-01',
  },

  // --- S3 ---
  {
    id: 'aws-005',
    type: 'flashcard',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['s3', 'storage'],
    front: 'Name the main S3 storage classes and their use cases.',
    back: 'S3 Standard (frequent access), S3 Intelligent-Tiering (unknown/changing patterns), S3 Standard-IA (infrequent but rapid access), S3 One Zone-IA (infrequent, single AZ), S3 Glacier Instant Retrieval (archive, millisecond access), S3 Glacier Flexible Retrieval (archive, minutes to hours), S3 Glacier Deep Archive (lowest cost, 12-hour retrieval).',
    explanation:
      'Choosing the right storage class can dramatically reduce costs. Lifecycle policies can automatically transition objects between classes based on age. S3 Intelligent-Tiering monitors access patterns and moves objects automatically with no retrieval fees.',
    createdAt: '2024-01-01',
  },
  {
    id: 'aws-006',
    type: 'multiple-choice',
    topic: 'aws',
    difficulty: 'advanced',
    tags: ['s3', 'security'],
    prompt: 'Which of the following is NOT a method to control access to S3 objects?',
    options: [
      { id: 'a', text: 'Bucket policies (resource-based JSON policies)' },
      { id: 'b', text: 'IAM policies attached to users/roles' },
      { id: 'c', text: 'Security groups attached to the S3 bucket' },
      { id: 'd', text: 'S3 Access Control Lists (ACLs)' },
    ],
    correctOptionId: 'c',
    timeLimitSeconds: 30,
    explanation:
      'Security groups are for network-level access control on resources like EC2 instances and RDS databases. They cannot be attached to S3 buckets. S3 access is controlled via bucket policies, IAM policies, ACLs, and S3 Access Points. AWS recommends disabling ACLs and using bucket policies instead.',
    createdAt: '2024-01-01',
  },

  // --- Lambda ---
  {
    id: 'aws-007',
    type: 'flashcard',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['lambda', 'serverless'],
    front: 'What is a Lambda cold start and how can you mitigate it?',
    back: 'A cold start occurs when Lambda must initialize a new execution environment (download code, start runtime, run init code). Mitigations include: Provisioned Concurrency, keeping function packages small, initializing SDK clients outside the handler, using SnapStart (Java), and choosing lighter runtimes.',
    explanation:
      'Cold starts add latency on the first invocation or when scaling up. Subsequent invocations reuse warm environments. Provisioned Concurrency keeps a set number of environments pre-initialized. The init phase (code outside the handler) runs once per environment and is included in cold start time.',
    createdAt: '2024-01-01',
  },
  {
    id: 'aws-008',
    type: 'multiple-choice',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['lambda', 'serverless'],
    prompt: 'What is the maximum execution timeout for a single AWS Lambda invocation?',
    options: [
      { id: 'a', text: '5 minutes' },
      { id: 'b', text: '15 minutes' },
      { id: 'c', text: '30 minutes' },
      { id: 'd', text: '60 minutes' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation:
      'AWS Lambda functions can run for a maximum of 15 minutes (900 seconds) per invocation. For longer-running tasks, consider Step Functions, ECS/Fargate, or breaking the work into smaller chunks. Other key limits: 10 GB memory, 10 GB ephemeral storage (/tmp), 6 MB synchronous payload.',
    createdAt: '2024-01-01',
  },

  // --- VPC ---
  {
    id: 'aws-009',
    type: 'flashcard',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['vpc', 'networking'],
    front: 'What is the difference between a Security Group and a Network ACL (NACL)?',
    back: 'Security Groups are stateful (return traffic automatically allowed), operate at the instance/ENI level, support allow rules only, and evaluate all rules. NACLs are stateless (must explicitly allow return traffic), operate at the subnet level, support allow and deny rules, and evaluate rules in order by number.',
    explanation:
      'Security Groups are the primary firewall mechanism for most use cases. NACLs provide a second layer of defense at the subnet level. A common pattern is to use NACLs to block known bad IPs and Security Groups for fine-grained application access control.',
    createdAt: '2024-01-01',
  },
  {
    id: 'aws-010',
    type: 'multiple-choice',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['vpc', 'networking'],
    prompt: 'A private subnet needs internet access for software updates but should not be reachable from the internet. What should you use?',
    options: [
      { id: 'a', text: 'Internet Gateway attached to the VPC' },
      { id: 'b', text: 'NAT Gateway in a public subnet' },
      { id: 'c', text: 'VPC Peering connection' },
      { id: 'd', text: 'AWS Direct Connect' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation:
      'A NAT Gateway allows instances in private subnets to initiate outbound internet connections while preventing unsolicited inbound connections. It is placed in a public subnet and the private subnet route table points 0.0.0.0/0 to the NAT Gateway. NAT Gateways are managed, highly available within an AZ, and scale automatically.',
    createdAt: '2024-01-01',
  },

  // --- RDS vs DynamoDB ---
  {
    id: 'aws-011',
    type: 'flashcard',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['rds', 'dynamodb', 'databases'],
    front: 'When would you choose DynamoDB over RDS?',
    back: 'Choose DynamoDB for: single-digit millisecond latency at any scale, key-value or document access patterns, massive write throughput, serverless/auto-scaling needs, and global tables. Choose RDS for: complex SQL queries with joins, ACID transactions across tables, relational data models, and reporting/analytics.',
    explanation:
      'DynamoDB is a fully managed NoSQL database that excels at high-throughput, low-latency workloads with known access patterns. RDS supports traditional relational engines (PostgreSQL, MySQL, etc.) with full SQL capabilities. DynamoDB Accelerator (DAX) adds microsecond read latency caching.',
    createdAt: '2024-01-01',
  },
  {
    id: 'aws-012',
    type: 'multiple-choice',
    topic: 'aws',
    difficulty: 'advanced',
    tags: ['rds', 'databases'],
    prompt: 'What is the purpose of an RDS Read Replica?',
    options: [
      { id: 'a', text: 'To provide automatic failover for the primary database' },
      { id: 'b', text: 'To offload read traffic and improve read performance' },
      { id: 'c', text: 'To encrypt database storage at rest' },
      { id: 'd', text: 'To replicate data across AWS accounts' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation:
      'Read Replicas use asynchronous replication to create read-only copies of your database. Applications can direct read queries to replicas, reducing load on the primary instance. Read Replicas can be promoted to standalone instances and can be created cross-region. For automatic failover, use Multi-AZ deployments instead.',
    createdAt: '2024-01-01',
  },

  // --- CloudFront ---
  {
    id: 'aws-013',
    type: 'flashcard',
    topic: 'aws',
    difficulty: 'beginner',
    tags: ['cloudfront', 'cdn'],
    front: 'What is Amazon CloudFront and how does it work?',
    back: 'CloudFront is a global Content Delivery Network (CDN) that caches content at 400+ edge locations worldwide. It reduces latency by serving content from the edge location closest to the user. Origins can be S3 buckets, ALBs, EC2 instances, or any HTTP server.',
    explanation:
      'CloudFront supports static and dynamic content, WebSocket, and live/on-demand video. It integrates with AWS WAF for security, ACM for free SSL/TLS certificates, and Lambda@Edge or CloudFront Functions for edge compute. Cache behaviors control how different URL patterns are handled.',
    createdAt: '2024-01-01',
  },

  // --- SQS vs SNS ---
  {
    id: 'aws-014',
    type: 'multiple-choice',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['sqs', 'sns', 'messaging'],
    prompt: 'What is the key difference between SQS and SNS?',
    options: [
      { id: 'a', text: 'SQS is pub-sub; SNS is point-to-point queuing' },
      { id: 'b', text: 'SQS is a message queue (pull-based); SNS is pub-sub (push-based)' },
      { id: 'c', text: 'SQS supports only JSON; SNS supports any format' },
      { id: 'd', text: 'SQS is serverless; SNS requires provisioned capacity' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation:
      'SQS is a pull-based message queue where consumers poll for messages. It decouples producers and consumers and guarantees each message is processed at least once. SNS is a push-based pub-sub service that fans out messages to multiple subscribers (Lambda, SQS, HTTP, email). A common pattern is SNS + SQS fanout for distributing messages to multiple independent consumers.',
    createdAt: '2024-01-01',
  },
  {
    id: 'aws-015',
    type: 'multiple-choice',
    topic: 'aws',
    difficulty: 'advanced',
    tags: ['sqs', 'messaging'],
    prompt: 'What problem does an SQS FIFO queue solve that a Standard queue does not?',
    options: [
      { id: 'a', text: 'Higher throughput (unlimited messages per second)' },
      { id: 'b', text: 'Guaranteed ordering and exactly-once processing' },
      { id: 'c', text: 'Larger maximum message size' },
      { id: 'd', text: 'Cross-region message replication' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation:
      'FIFO queues guarantee that messages are processed exactly once and in the exact order they are sent, using message group IDs and deduplication IDs. Standard queues offer best-effort ordering and at-least-once delivery but provide nearly unlimited throughput. FIFO queues are limited to 3,000 messages/second with batching.',
    createdAt: '2024-01-01',
  },

  // --- ECS/EKS ---
  {
    id: 'aws-016',
    type: 'flashcard',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['ecs', 'eks', 'containers'],
    front: 'What is the difference between ECS and EKS?',
    back: 'ECS (Elastic Container Service) is AWS\'s proprietary container orchestrator — simpler, tightly integrated with AWS services. EKS (Elastic Kubernetes Service) runs managed Kubernetes — use it when you need Kubernetes compatibility, portability, or have existing K8s expertise. Both support Fargate (serverless) and EC2 launch types.',
    explanation:
      'ECS is easier to set up and has deeper native AWS integration (IAM task roles, CloudWatch, ALB). EKS is ideal for teams already using Kubernetes or needing multi-cloud portability. Fargate removes the need to manage underlying servers for either service, charging per vCPU and memory per second.',
    createdAt: '2024-01-01',
  },

  // --- Route 53 ---
  {
    id: 'aws-017',
    type: 'multiple-choice',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['route53', 'dns'],
    prompt: 'Which Route 53 routing policy sends traffic to the resource with the lowest network latency for the end user?',
    options: [
      { id: 'a', text: 'Simple routing' },
      { id: 'b', text: 'Weighted routing' },
      { id: 'c', text: 'Latency-based routing' },
      { id: 'd', text: 'Geolocation routing' },
    ],
    correctOptionId: 'c',
    timeLimitSeconds: 30,
    explanation:
      'Latency-based routing directs users to the AWS region that provides the lowest latency. Weighted routing distributes traffic by percentages you define. Geolocation routing is based on the user\'s geographic location (country/continent). Failover routing routes to a standby resource when the primary is unhealthy.',
    createdAt: '2024-01-01',
  },

  // --- CloudWatch ---
  {
    id: 'aws-018',
    type: 'flashcard',
    topic: 'aws',
    difficulty: 'beginner',
    tags: ['cloudwatch', 'monitoring'],
    front: 'What are the three main features of Amazon CloudWatch?',
    back: 'Metrics (collect and track numerical data points like CPU, network), Logs (collect, store, and query log data from services and applications), and Alarms (trigger notifications or automated actions when metrics cross thresholds). Also includes Dashboards, Events/EventBridge integration, and Insights.',
    explanation:
      'CloudWatch is the central monitoring service for AWS. Default metrics are provided at 5-minute intervals (1-minute with detailed monitoring). Custom metrics allow you to publish your own application data. CloudWatch Logs Insights provides SQL-like query capabilities for log analysis.',
    createdAt: '2024-01-01',
  },

  // --- ELB ---
  {
    id: 'aws-019',
    type: 'multiple-choice',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['elb', 'networking'],
    prompt: 'When should you choose a Network Load Balancer (NLB) over an Application Load Balancer (ALB)?',
    options: [
      { id: 'a', text: 'When you need path-based routing for HTTP traffic' },
      { id: 'b', text: 'When you need ultra-low latency and millions of requests per second with TCP/UDP' },
      { id: 'c', text: 'When you need to inspect HTTP headers for routing decisions' },
      { id: 'd', text: 'When you need built-in authentication with OIDC providers' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation:
      'NLB operates at Layer 4 (TCP/UDP), provides ultra-low latency, handles millions of requests per second, and preserves the source IP. ALB operates at Layer 7 (HTTP/HTTPS) and supports path-based routing, host-based routing, authentication, and WebSocket. Use ALB for web applications and NLB for TCP/UDP workloads, gaming, or IoT.',
    createdAt: '2024-01-01',
  },

  // --- API Gateway ---
  {
    id: 'aws-020',
    type: 'flashcard',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['api-gateway', 'serverless'],
    front: 'What is Amazon API Gateway and what are its two main types?',
    back: 'API Gateway is a managed service for creating, publishing, and managing APIs at any scale. REST APIs offer full API management features (caching, request validation, WAF). HTTP APIs are simpler and cheaper, optimized for Lambda and HTTP backends with up to 60% lower cost. Also supports WebSocket APIs for real-time communication.',
    explanation:
      'API Gateway handles throttling, authorization (IAM, Cognito, Lambda authorizers), request/response transformation, and usage plans with API keys. It integrates directly with Lambda, creating a fully serverless API. Stage variables and canary deployments enable safe rollouts.',
    createdAt: '2024-01-01',
  },

  // --- CloudFormation / IaC ---
  {
    id: 'aws-021',
    type: 'multiple-choice',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['cloudformation', 'iac'],
    prompt: 'What happens if a CloudFormation stack update fails midway?',
    options: [
      { id: 'a', text: 'The stack is deleted and must be recreated' },
      { id: 'b', text: 'The stack automatically rolls back to its previous working state' },
      { id: 'c', text: 'The partially updated resources remain and the stack enters a failed state with no recovery' },
      { id: 'd', text: 'Only the failed resource is removed; other changes persist' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation:
      'CloudFormation performs automatic rollback on stack update failures by default, reverting all resources to their previous state. This ensures infrastructure consistency. You can disable rollback for debugging. Drift detection shows when resources have been modified outside of CloudFormation.',
    createdAt: '2024-01-01',
  },
  {
    id: 'aws-022',
    type: 'coding-challenge',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['cloudformation', 'iac'],
    mode: 'fix',
    prompt: 'Fix this CloudFormation-style infrastructure config object so the Lambda function correctly references the IAM role and has proper configuration.',
    starterCode: `// Fix the infrastructure config for a Lambda function
const infraConfig = {
  lambdaFunction: {
    runtime: 'nodejs18.x',
    handler: 'index.handler',
    memorySize: 128,
    timeout: 900, // Bug 1: timeout is in seconds, max is 900 but this function only needs 30s
    role: 'my-lambda-role', // Bug 2: should reference the role ARN, not just the name
    environment: {
      TABLE_NAME: 'users-table',
      STAGE: process.env.STAGE, // Bug 3: should have a fallback default
    },
  },
  apiGateway: {
    type: 'REST', // Bug 4: HTTP API is more cost-effective for simple Lambda proxy
    routes: [
      { method: 'GET', path: '/users' },
      { method: 'POST', path: '/users' },
    ],
  },
};`,
    solutionCode: `const infraConfig = {
  lambdaFunction: {
    runtime: 'nodejs18.x',
    handler: 'index.handler',
    memorySize: 128,
    timeout: 30,
    role: \`arn:aws:iam::\${process.env.AWS_ACCOUNT_ID}:role/my-lambda-role\`,
    environment: {
      TABLE_NAME: 'users-table',
      STAGE: process.env.STAGE || 'dev',
    },
  },
  apiGateway: {
    type: 'HTTP',
    routes: [
      { method: 'GET', path: '/users' },
      { method: 'POST', path: '/users' },
    ],
  },
};`,
    language: 'typescript',
    hints: [
      'Lambda timeout should match the expected execution time, not the maximum',
      'IAM roles are referenced by their full ARN, not just the name',
      'Environment variables should have fallback defaults for local development',
      'HTTP APIs are simpler and cheaper than REST APIs for Lambda proxy integrations',
    ],
    explanation:
      'When configuring Lambda infrastructure: set timeout to match actual needs (not max), always use full ARN for role references, provide environment variable defaults, and choose HTTP APIs over REST APIs when you only need simple proxy functionality (up to 60% cheaper).',
    createdAt: '2024-01-01',
  },

  // --- Well-Architected Framework ---
  {
    id: 'aws-023',
    type: 'flashcard',
    topic: 'aws',
    difficulty: 'advanced',
    tags: ['well-architected', 'architecture'],
    front: 'What are the six pillars of the AWS Well-Architected Framework?',
    back: '1. Operational Excellence — automate operations, respond to events, learn from failures. 2. Security — protect data, manage access, detect events. 3. Reliability — recover from failures, meet demand, mitigate disruptions. 4. Performance Efficiency — use resources efficiently, monitor performance. 5. Cost Optimization — avoid unnecessary costs, analyze spending. 6. Sustainability — minimize environmental impact of cloud workloads.',
    explanation:
      'The Well-Architected Framework provides best practices for designing systems on AWS. The Well-Architected Tool in the console lets you review workloads against these pillars. Each pillar has design principles and specific best practices with detailed whitepapers.',
    createdAt: '2024-01-01',
  },

  // --- Coding Challenges ---
  {
    id: 'aws-024',
    type: 'coding-challenge',
    topic: 'aws',
    difficulty: 'beginner',
    tags: ['s3', 'sdk'],
    mode: 'complete',
    prompt: 'Complete the function to list all objects in an S3 bucket using the AWS SDK v3. Handle pagination to ensure all objects are returned.',
    starterCode: `import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const client = new S3Client({ region: 'us-east-1' });

async function listAllObjects(bucketName: string): Promise<string[]> {
  const allKeys: string[] = [];
  // TODO: Use ListObjectsV2Command with pagination
  // Hint: Check for IsTruncated and use ContinuationToken


  return allKeys;
}`,
    solutionCode: `import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const client = new S3Client({ region: 'us-east-1' });

async function listAllObjects(bucketName: string): Promise<string[]> {
  const allKeys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      ContinuationToken: continuationToken,
    });

    const response = await client.send(command);

    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key) {
          allKeys.push(obj.Key);
        }
      }
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return allKeys;
}`,
    language: 'typescript',
    hints: [
      'ListObjectsV2 returns up to 1,000 keys per call',
      'Check IsTruncated to know if there are more results',
      'Use NextContinuationToken from the response as ContinuationToken in the next request',
    ],
    explanation:
      'S3 ListObjectsV2 returns a maximum of 1,000 keys per request. For buckets with more objects, you must paginate using the ContinuationToken. The AWS SDK v3 also offers paginators (paginateListObjectsV2) that handle this automatically, but understanding manual pagination is important for interviews.',
    createdAt: '2024-01-01',
  },
  {
    id: 'aws-025',
    type: 'coding-challenge',
    topic: 'aws',
    difficulty: 'intermediate',
    tags: ['lambda', 'dynamodb', 'serverless'],
    mode: 'read',
    prompt: 'Read this Lambda handler that processes SQS messages and writes to DynamoDB. Identify what each part does, explain the error handling pattern, and describe why the function returns partial batch failures.',
    starterCode: `import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import type { SQSEvent, SQSBatchResponse } from 'aws-lambda';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const batchItemFailures: { itemIdentifier: string }[] = [];

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          pk: body.userId,
          sk: \`ORDER#\${body.orderId}\`,
          ...body,
          createdAt: new Date().toISOString(),
        },
        ConditionExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)',
      }));
    } catch (error) {
      console.error('Failed to process record:', record.messageId, error);
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
};`,
    solutionCode: `// This Lambda function:
// 1. Initializes DynamoDB client OUTSIDE the handler (reused across warm invocations)
// 2. Processes each SQS message independently in a loop
// 3. Uses DynamoDB single-table design (pk/sk pattern) for the item structure
// 4. ConditionExpression prevents overwriting existing items (idempotent writes)
// 5. Returns partial batch failures - only failed messageIds are reported
//    SQS will retry ONLY the failed messages, not the entire batch
//    This requires "ReportBatchItemFailures" in the event source mapping config
// 6. Error handling: catches per-record so one failure doesn't block the batch`,
    language: 'typescript',
    hints: [
      'Notice where the DynamoDB client is initialized — why outside the handler?',
      'Look at the ConditionExpression — what problem does it solve?',
      'The return type SQSBatchResponse with batchItemFailures enables partial batch failure reporting',
    ],
    explanation:
      'This pattern demonstrates several AWS best practices: initializing clients outside the handler for connection reuse across warm invocations, using DynamoDB single-table design with composite keys, conditional writes for idempotency, and SQS partial batch failure reporting to avoid reprocessing successful messages. The ReportBatchItemFailures feature source mapping setting must be enabled for this to work.',
    createdAt: '2024-01-01',
  },
];
