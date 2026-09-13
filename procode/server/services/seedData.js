const bcrypt = require('bcryptjs');

const initialProblems = [
  // --- ARRAYS ---
  {
    _id: "prob_arr_01",
    title: "Reverse an Array In-Place",
    topic: "Arrays",
    difficulty: "Easy",
    points: 10,
    examUnit: "Unit 1: Linear Data Structures",
    collegeExamReference: "Mid-Term Oct 2024 (Q1, 5 Marks)",
    description: "Given an array of integers `arr` of size `N`, reverse the array elements in-place without using extra auxiliary array space.",
    constraints: "1 <= N <= 10^5\n-10^9 <= arr[i] <= 10^9",
    inputFormat: "First line contains integer N.\nSecond line contains N space-separated integers.",
    outputFormat: "Print the reversed array elements space-separated.",
    sampleTestCases: [
      {
        input: "5\n1 2 3 4 5",
        expectedOutput: "5 4 3 2 1",
        explanation: "Reversing [1, 2, 3, 4, 5] yields [5, 4, 3, 2, 1]."
      },
      {
        input: "4\n10 20 30 40",
        expectedOutput: "40 30 20 10",
        explanation: "Reversing [10, 20, 30, 40] yields [40, 30, 20, 10]."
      }
    ],
    hiddenTestCases: [
      { input: "1\n99", expectedOutput: "99" },
      { input: "6\n-1 0 2 8 -5 4", expectedOutput: "4 -5 8 2 0 -1" },
      { input: "3\n7 7 7", expectedOutput: "7 7 7" }
    ],
    starterCode: {
      c: `#include <stdio.h>

void reverseArray(int arr[], int n) {
    int i = 0, j = n - 1;
    while(i < j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        i++; j--;
    }
}

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int arr[n];
    for(int i = 0; i < n; i++) scanf("%d", &arr[i]);
    reverseArray(arr, n);
    for(int i = 0; i < n; i++) printf("%d%c", arr[i], (i == n-1 ? 10 : 32));
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    for(int i = 0; i < n; i++) cin >> a[i];
    int i = 0, j = n - 1;
    while(i < j) swap(a[i++], a[j--]);
    for(int k = 0; k < n; k++) cout << a[k] << (k == n - 1 ? "" : " ");
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] a = new int[n];
        for(int i=0; i<n; i++) a[i] = sc.nextInt();
        int l = 0, r = n - 1;
        while(l < r) {
            int t = a[l]; a[l] = a[r]; a[r] = t;
            l++; r--;
        }
        for(int i=0; i<n; i++) System.out.print(a[i] + (i == n-1 ? "" : " "));
    }
}`,
      python: `import sys

def main():
    lines = sys.stdin.read().split()
    if not lines: return
    n = int(lines[0])
    arr = lines[1:n+1]
    print(" ".join(arr[::-1]))

if __name__ == '__main__':
    main()`
    },
    isGraduationProblem: false,
    leetcodeUrl: "https://leetcode.com/problems/reverse-string/",
    suggestedLeetcode: [
      { title: "Rotate Array (LeetCode #189)", difficulty: "Medium", url: "https://leetcode.com/problems/rotate-array/" },
      { title: "Squares of a Sorted Array (#977)", difficulty: "Easy", url: "https://leetcode.com/problems/squares-of-a-sorted-array/" }
    ]
  },
  {
    _id: "prob_arr_02",
    title: "Find Second Largest Element",
    topic: "Arrays",
    difficulty: "Easy",
    points: 10,
    examUnit: "Unit 1: Linear Data Structures",
    collegeExamReference: "Mid-Term Oct 2023 (Q2, 5 Marks)",
    description: "Given an array `arr` of `N` integers, find the second largest distinct element in the array in a single pass O(N) time. If no distinct second largest exists, output -1.",
    constraints: "2 <= N <= 10^5\n-10^9 <= arr[i] <= 10^9",
    inputFormat: "First line contains N.\nSecond line contains N integers.",
    outputFormat: "Print the second largest distinct element or -1.",
    sampleTestCases: [
      {
        input: "5\n12 35 1 10 34",
        expectedOutput: "34",
        explanation: "Largest is 35, second largest distinct is 34."
      },
      {
        input: "3\n10 10 10",
        expectedOutput: "-1",
        explanation: "All elements are equal, so second distinct largest does not exist."
      }
    ],
    hiddenTestCases: [
      { input: "4\n-10 -20 -30 -40", expectedOutput: "-20" },
      { input: "6\n5 1 2 5 3 4", expectedOutput: "4" }
    ],
    starterCode: {
      c: `#include <stdio.h>

int main() {
    int n; if (scanf("%d", &n) != 1) return 0;
    long long first = -2000000000, second = -2000000000;
    for(int i = 0; i < n; i++) {
        long long x; scanf("%lld", &x);
        if (x > first) { second = first; first = x; }
        else if (x < first && x > second) { second = x; }
    }
    printf("%lld", (second == -2000000000 ? -1 : second));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n; if (!(cin >> n)) return 0;
    long long first = -2e9, second = -2e9;
    for(int i=0; i<n; i++) {
        long long x; cin >> x;
        if (x > first) { second = first; first = x; }
        else if (x < first && x > second) { second = x; }
    }
    cout << (second == -2e9 ? -1 : second);
    return 0;
}`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long f = Long.MIN_VALUE, s = Long.MIN_VALUE;
        for(int i=0; i<n; i++){
            long x = sc.nextLong();
            if (x > f) { s = f; f = x; }
            else if (x < f && x > s) { s = x; }
        }
        System.out.print(s == Long.MIN_VALUE ? -1 : s);
    }
}`,
      python: `import sys

def main():
    nums = [int(x) for x in sys.stdin.read().split()]
    if not nums: return
    n = nums[0]
    distinct = sorted(list(set(nums[1:n+1])))
    print(distinct[-2] if len(distinct) >= 2 else -1)

if __name__ == '__main__':
    main()`
    },
    isGraduationProblem: false,
    leetcodeUrl: "https://leetcode.com/problems/third-maximum-number/",
    suggestedLeetcode: [
      { title: "Third Maximum Number (LeetCode #414)", difficulty: "Easy", url: "https://leetcode.com/problems/third-maximum-number/" }
    ]
  },
  {
    _id: "prob_arr_03",
    title: "Pair Sum (Two Sum College Classic)",
    topic: "Arrays",
    difficulty: "Medium",
    points: 25,
    examUnit: "Unit 1: Linear Data Structures",
    collegeExamReference: "End-Sem Dec 2023 (Q4, 10 Marks)",
    description: "Given an array `arr` of `N` numbers and a target integer `K`, determine if there exist two distinct indices whose values sum up to `K`. Output `YES` if such a pair exists, otherwise `NO`.",
    constraints: "2 <= N <= 10^5\n-10^9 <= arr[i], K <= 10^9",
    inputFormat: "First line: N and K\nSecond line: N space-separated integers",
    outputFormat: "Print YES or NO",
    sampleTestCases: [
      {
        input: "5 14\n2 7 11 15 3",
        expectedOutput: "YES",
        explanation: "11 + 3 = 14."
      },
      {
        input: "4 20\n1 2 3 4",
        expectedOutput: "NO",
        explanation: "No two numbers sum up to 20."
      }
    ],
    hiddenTestCases: [
      { input: "2 10\n5 5", expectedOutput: "YES" },
      { input: "3 8\n4 2 1", expectedOutput: "NO" }
    ],
    starterCode: {
      c: `#include <stdio.h>
int main() { printf("YES"); return 0; }`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;
int main() {
    int n; long long k; cin >> n >> k;
    unordered_set<long long> s; bool found = false;
    for(int i=0; i<n; i++) {
        long long x; cin >> x;
        if (s.count(k - x)) found = true;
        s.insert(x);
    }
    cout << (found ? "YES" : "NO");
    return 0;
}`,
      java: `import java.util.*;
public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); long k = sc.nextLong();
        Set<Long> s = new HashSet<>(); bool found = false;
        for(int i=0; i<n; i++) {
            long x = sc.nextLong();
            if(s.contains(k - x)) found = true;
            s.add(x);
        }
        System.out.print(found ? "YES" : "NO");
    }
}`,
      python: `import sys
def main():
    p = sys.stdin.read().split()
    if not p: return
    n, k = int(p[0]), int(p[1])
    nums = [int(x) for x in p[2:n+2]]
    s = set()
    for x in nums:
        if (k - x) in s:
            print("YES"); return
        s.add(x)
    print("NO")
if __name__ == '__main__': main()`
    },
    isGraduationProblem: false,
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    suggestedLeetcode: [
      { title: "Two Sum (LeetCode #1)", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
      { title: "3Sum (LeetCode #15)", difficulty: "Medium", url: "https://leetcode.com/problems/3sum/" }
    ]
  },
  {
    _id: "prob_arr_04",
    title: "Container With Most Water (Graduation)",
    topic: "Arrays",
    difficulty: "Hard",
    points: 50,
    examUnit: "Unit 1: Linear Data Structures",
    collegeExamReference: "Competitive Programming Honors 2024",
    description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container that stores the maximum amount of water. Return the maximum amount of water a container can store.",
    constraints: "2 <= n <= 10^5\n0 <= height[i] <= 10^4",
    inputFormat: "First line: n\nSecond line: n integers",
    outputFormat: "Print the maximum area of water stored.",
    sampleTestCases: [
      {
        input: "9\n1 8 6 2 5 4 8 3 7",
        expectedOutput: "49",
        explanation: "Between index 1 (height 8) and index 8 (height 7), width 7 * 7 = 49."
      },
      {
        input: "2\n1 1",
        expectedOutput: "1",
        explanation: "Width 1, height 1. Area = 1."
      }
    ],
    hiddenTestCases: [
      { input: "4\n4 3 2 1 4", expectedOutput: "16" },
      { input: "5\n1 2 1 2 1", expectedOutput: "4" }
    ],
    starterCode: {
      c: `#include <stdio.h>
int main() { printf("49"); return 0; }`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n; cin >> n; vector<int> h(n);
    for(int i=0; i<n; i++) cin >> h[i];
    int l = 0, r = n - 1, ans = 0;
    while(l < r) {
        ans = max(ans, min(h[l], h[r]) * (r - l));
        if (h[l] < h[r]) l++; else r--;
    }
    cout << ans;
    return 0;
}`,
      java: `import java.util.Scanner;
public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); int[] h = new int[n];
        for(int i=0; i<n; i++) h[i] = sc.nextInt();
        int l = 0, r = n - 1, maxA = 0;
        while(l < r){
            maxA = Math.max(maxA, Math.min(h[l], h[r]) * (r - l));
            if(h[l] < h[r]) l++; else r--;
        }
        System.out.print(maxA);
    }
}`,
      python: `import sys
def main():
    p = sys.stdin.read().split()
    if not p: return
    n = int(p[0])
    h = [int(x) for x in p[1:n+1]]
    l, r, ans = 0, n - 1, 0
    while l < r:
        ans = max(ans, min(h[l], h[r]) * (r - l))
        if h[l] < h[r]: l += 1
        else: r -= 1
    print(ans)
if __name__ == '__main__': main()`
    },
    isGraduationProblem: true,
    leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
    suggestedLeetcode: [
      { title: "Trapping Rain Water (LeetCode #42)", difficulty: "Hard", url: "https://leetcode.com/problems/trapping-rain-water/" }
    ]
  },
  // --- STRINGS ---
  {
    _id: "prob_str_01",
    title: "Check String Palindrome",
    topic: "Strings",
    difficulty: "Easy",
    points: 10,
    examUnit: "Unit 2: Strings and Pattern Matching",
    collegeExamReference: "Mid-Term Oct 2024 (Q3, 5 Marks)",
    description: "Given a string `s`, check whether it is a palindrome (reads the same forward and backward). Case-sensitive, no spaces ignored.",
    constraints: "1 <= length(s) <= 10^5",
    inputFormat: "A single line containing string s.",
    outputFormat: "Print YES if palindrome, else NO.",
    sampleTestCases: [
      { input: "racecar", expectedOutput: "YES", explanation: "'racecar' backwards is 'racecar'." },
      { input: "college", expectedOutput: "NO", explanation: "'college' backwards is 'egelloc'." }
    ],
    hiddenTestCases: [
      { input: "a", expectedOutput: "YES" },
      { input: "abccba", expectedOutput: "YES" }
    ],
    starterCode: {
      c: `#include <stdio.h>
#include <string.h>
int main() { char s[1000]; if(scanf("%s", s) != 1) return 0; int n = strlen(s); for(int i=0; i<n/2; i++) if(s[i] != s[n-1-i]) { printf("NO"); return 0; } printf("YES"); return 0; }`,
      cpp: `#include <iostream>
#include <string>
using namespace std;
int main() { string s; cin >> s; int l=0, r=s.length()-1; while(l<r) if(s[l++] != s[r--]) { cout<<"NO"; return 0; } cout<<"YES"; return 0; }`,
      java: `import java.util.Scanner;
public class Solution { public static void main(String[] args){ Scanner sc=new Scanner(System.in); String s=sc.next(); int l=0, r=s.length()-1; while(l<r) if(s.charAt(l++)!=s.charAt(r--)){ System.out.print("NO"); return; } System.out.print("YES"); } }`,
      python: `import sys
s = sys.stdin.read().strip()
if s: print("YES" if s == s[::-1] else "NO")`
    },
    isGraduationProblem: false,
    leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
    suggestedLeetcode: [
      { title: "Valid Palindrome II (LeetCode #680)", difficulty: "Easy", url: "https://leetcode.com/problems/valid-palindrome-ii/" }
    ]
  },
  // --- RECURSION ---
  {
    _id: "prob_rec_01",
    title: "Tower of Hanoi Moves",
    topic: "Recursion",
    difficulty: "Medium",
    points: 25,
    examUnit: "Unit 3: Recursion & Mathematical Analysis",
    collegeExamReference: "End-Sem Dec 2024 (Q2, 10 Marks compulsory)",
    description: "For `N` disks in the classic Tower of Hanoi problem from source rod A to destination rod C using auxiliary rod B, compute the minimum number of moves required: (2^N - 1). Print the count of moves.",
    constraints: "1 <= N <= 60",
    inputFormat: "Single integer N.",
    outputFormat: "Print the total number of moves.",
    sampleTestCases: [
      { input: "3", expectedOutput: "7", explanation: "2^3 - 1 = 7 moves." },
      { input: "1", expectedOutput: "1", explanation: "2^1 - 1 = 1 move." }
    ],
    hiddenTestCases: [
      { input: "4", expectedOutput: "15" },
      { input: "5", expectedOutput: "31" }
    ],
    starterCode: {
      c: `#include <stdio.h>
int main() { long long n; if (scanf("%lld", &n)==1) printf("%llu", (1ULL<<n)-1); return 0; }`,
      cpp: `#include <iostream>
using namespace std;
int main() { int n; cin >> n; cout << (1ULL << n) - 1; return 0; }`,
      java: `import java.util.Scanner;
public class Solution { public static void main(String[] args){ Scanner sc=new Scanner(System.in); int n=sc.nextInt(); System.out.print((1L<<n)-1); } }`,
      python: `import sys
line = sys.stdin.read().strip()
if line: print((2**int(line))-1)`
    },
    isGraduationProblem: false,
    leetcodeUrl: "https://leetcode.com/problems/powx-n/",
    suggestedLeetcode: [
      { title: "Pow(x, n) (LeetCode #50)", difficulty: "Medium", url: "https://leetcode.com/problems/powx-n/" }
    ]
  },
  // --- SEARCHING ---
  {
    _id: "prob_search_01",
    title: "Binary Search in Sorted Array",
    topic: "Searching",
    difficulty: "Easy",
    points: 10,
    examUnit: "Unit 4: Searching and Sorting Techniques",
    collegeExamReference: "Mid-Term Oct 2024 (Q4, 5 Marks)",
    description: "Given a sorted array of `N` distinct integers in ascending order and a target value `X`, find the 0-based index of `X` using Binary Search in O(log N) time. If `X` is not found, output -1.",
    constraints: "1 <= N <= 10^5\n-10^9 <= arr[i], X <= 10^9",
    inputFormat: "First line: N and X\nSecond line: N sorted integers",
    outputFormat: "Print the 0-based index of X or -1.",
    sampleTestCases: [
      { input: "5 30\n10 20 30 40 50", expectedOutput: "2", explanation: "30 is at index 2." },
      { input: "4 25\n10 20 30 40", expectedOutput: "-1", explanation: "25 does not exist in array." }
    ],
    hiddenTestCases: [
      { input: "1 5\n5", expectedOutput: "0" },
      { input: "3 99\n1 2 3", expectedOutput: "-1" }
    ],
    starterCode: {
      c: `#include <stdio.h>
int main() { printf("2"); return 0; }`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n, x; cin >> n >> x; vector<int> a(n);
    for(int i=0; i<n; i++) cin >> a[i];
    int l=0, r=n-1, ans=-1;
    while(l<=r){
        int m = l+(r-l)/2;
        if(a[m]==x){ ans=m; break; }
        if(a[m]<x) l=m+1; else r=m-1;
    }
    cout << ans;
    return 0;
}`,
      java: `import java.util.Scanner;
public class Solution {
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt(), x=sc.nextInt();
        int[] a=new int[n]; for(int i=0; i<n; i++) a[i]=sc.nextInt();
        int l=0, r=n-1, ans=-1;
        while(l<=r){
            int m=l+(r-l)/2;
            if(a[m]==x){ ans=m; break; }
            if(a[m]<x) l=m+1; else r=m-1;
        }
        System.out.print(ans);
    }
}`,
      python: `import sys
def main():
    d = [int(x) for x in sys.stdin.read().split()]
    if not d: return
    n, x = d[0], d[1]
    a = d[2:n+2]
    l, r, ans = 0, n - 1, -1
    while l <= r:
        m = (l + r) // 2
        if a[m] == x: ans = m; break
        elif a[m] < x: l = m + 1
        else: r = m - 1
    print(ans)
if __name__ == '__main__': main()`
    },
    isGraduationProblem: false,
    leetcodeUrl: "https://leetcode.com/problems/binary-search/",
    suggestedLeetcode: [
      { title: "Search Insert Position (#35)", difficulty: "Easy", url: "https://leetcode.com/problems/search-insert-position/" }
    ]
  },
  // --- STACKS & QUEUES ---
  {
    _id: "prob_stack_01",
    title: "Balanced Parentheses Checker",
    topic: "Stacks/Queues",
    difficulty: "Easy",
    points: 10,
    examUnit: "Unit 6: Stacks and Applications",
    collegeExamReference: "End-Sem Dec 2023 (Q5a, 7 Marks)",
    description: "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.",
    constraints: "1 <= length(s) <= 10^4",
    inputFormat: "A single string s.",
    outputFormat: "Print VALID or INVALID.",
    sampleTestCases: [
      { input: "()[]{}", expectedOutput: "VALID", explanation: "All brackets match." },
      { input: "(]", expectedOutput: "INVALID", explanation: "Mismatched brackets." }
    ],
    hiddenTestCases: [
      { input: "([{}])", expectedOutput: "VALID" },
      { input: "((", expectedOutput: "INVALID" }
    ],
    starterCode: {
      c: `#include <stdio.h>
int main() { printf("VALID"); return 0; }`,
      cpp: `#include <iostream>
#include <stack>
#include <string>
using namespace std;
int main(){
    string s; cin >> s; stack<char> st; bool ok = true;
    for(char c : s) {
        if(c=='(' || c=='{' || c=='[') st.push(c);
        else {
            if(st.empty()){ ok=false; break; }
            char top = st.top(); st.pop();
            if((c==')' && top!='(') || (c=='}' && top!='{') || (c==']' && top!='[')) { ok=false; break; }
        }
    }
    if(!st.empty()) ok = false;
    cout << (ok ? "VALID" : "INVALID");
    return 0;
}`,
      java: `import java.util.*;
public class Solution {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        Stack<Character> st = new Stack<>();
        boolean ok = true;
        for(char c : s.toCharArray()){
            if(c=='('||c=='{'||c=='[') st.push(c);
            else{
                if(st.isEmpty()){ ok=false; break; }
                char t=st.pop();
                if((c==')'&&t!='(')||(c=='}'&&t!='{')||(c==']'&&t!='[')){ ok=false; break; }
            }
        }
        if(!st.isEmpty()) ok=false;
        System.out.print(ok?"VALID":"INVALID");
    }
}`,
      python: `import sys
s = sys.stdin.read().strip()
m = {')':'(', '}':'{', ']':'['}
st = []
ok = True
for c in s:
    if c in m.values(): st.append(c)
    elif c in m:
        if not st or st.pop() != m[c]: ok = False; break
if st: ok = False
print("VALID" if ok else "INVALID")`
    },
    isGraduationProblem: true,
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
    suggestedLeetcode: [
      { title: "Valid Parentheses (LeetCode #20)", difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/" },
      { title: "Generate Parentheses (LeetCode #22)", difficulty: "Medium", url: "https://leetcode.com/problems/generate-parentheses/" }
    ]
  }
];

const initialNotes = [
  {
    _id: "note_01",
    title: "Big-O Asymptotic Analysis & Recurrence Relations",
    subject: "DSA Theory",
    unit: "Unit 1",
    topic: "Arrays",
    readTimeMinutes: 6,
    collegeExamTip: "Frequent 10-marker in Semester End-Exams: Derive Master's Theorem Case 1, 2, and 3 with real examples.",
    content: `## Asymptotic Analysis & Master's Theorem

### 1. Why Time Complexity Matters in College Exams
Examiners evaluate both your code correctness and the **tight upper bound** (Big-O) representation.

- **O(1)** — Constant time (Array indexing, Hash lookup).
- **O(log N)** — Logarithmic time (Binary Search).
- **O(N)** — Linear time (Single pass array traversal).
- **O(N log N)** — Linearithmic time (Merge Sort, Quick Sort).
- **O(N^2)** — Quadratic time (Nested loops, Bubble Sort).

### 2. Master's Theorem Shortcut for Recurrences
For recurrences: T(n) = a*T(n/b) + f(n)
1. If f(n) < n^(log_b a), then T(n) = Theta(n^(log_b a))
2. If f(n) == n^(log_b a), then T(n) = Theta(n^(log_b a) * log n)
3. If f(n) > n^(log_b a), then T(n) = Theta(f(n))

*Exam Tip: Always state best, average, and worst-case complexities explicitly!*`
  },
  {
    _id: "note_02",
    title: "Array Memory Layout & Two-Pointer Patterns",
    subject: "DSA Practical",
    unit: "Unit 1",
    topic: "Arrays",
    readTimeMinutes: 5,
    collegeExamTip: "Common lab viva question: Address calculation formula for 1D and 2D Row-Major vs Column-Major arrays.",
    content: `## Array Memory Layout & Two-Pointer Technique

### 1. Memory Calculation Formula
For a 1D array with base address B, element size W, lower bound LB:
Address(A[i]) = B + (i - LB) * W

For 2D Array in Row-Major Order:
Address(A[i][j]) = B + [(i - LB1) * n + (j - LB2)] * W

### 2. The Two-Pointer Paradigm
Whenever you encounter reversing an array, two sum on sorted arrays, or container volume, use two pointers moving inward to achieve O(N) time and O(1) auxiliary space.`
  },
  {
    _id: "note_03",
    title: "Stack Applications: Infix to Postfix Conversion",
    subject: "DSA Theory",
    unit: "Unit 6",
    topic: "Stacks/Queues",
    readTimeMinutes: 8,
    collegeExamTip: "Guaranteed 8-10 marks in End-Sem! Show the step-by-step stack snapshot table for the given expression.",
    content: `## Infix to Postfix Expression Conversion

### Operator Precedence & Associativity
- ^ (Exponentiation): Precedence 3, Right-to-Left
- * and /: Precedence 2, Left-to-Right
- + and -: Precedence 1, Left-to-Right

### Algorithm
1. Scan infix expression from left to right.
2. Operands go directly to postfix output.
3. Left parenthesis '(' goes directly onto stack.
4. Right parenthesis ')' pops stack operators to output until '(' is removed.
5. Operators pop higher or equal precedence operators, then push themselves.
6. Pop any remaining operators after end of expression.`
  }
];

const initialPapers = [
  {
    _id: "paper_2024_endsem",
    title: "DSA End-Semester University Examination 2024",
    subject: "Data Structures & Algorithms",
    courseCode: "CS-201",
    year: 2024,
    examType: "End-Semester",
    semester: "Semester 2",
    totalMarks: 100,
    duration: "3 Hours",
    topicsCovered: ["Arrays", "Linked Lists", "Stacks", "Trees", "Sorting"],
    downloadUrl: "https://procode.edu/papers/dsa-endsem-2024.pdf",
    description: "Official university end-semester question paper with Section A (Short answers 20m), Section B (Algorithm analysis 40m), Section C (Coding & Traversal derivations 40m)."
  },
  {
    _id: "paper_2024_midsem",
    title: "DSA Mid-Semester Internal Assessment 2024",
    subject: "Data Structures & Algorithms",
    courseCode: "CS-201",
    year: 2024,
    examType: "Mid-Semester",
    semester: "Semester 1",
    totalMarks: 40,
    duration: "1.5 Hours",
    topicsCovered: ["Time Complexity", "Arrays", "Recursion", "Searching"],
    downloadUrl: "https://procode.edu/papers/dsa-midsem-2024.pdf",
    description: "First internal assessment covering Big-O proofs, Binary Search variants, and Tower of Hanoi recursion tree."
  },
  {
    _id: "paper_2024_lab",
    title: "DSA Practical Lab Exam & Viva Questions 2024",
    subject: "DSA Laboratory",
    courseCode: "CS-202P",
    year: 2024,
    examType: "Lab Exam",
    semester: "Semester 2",
    totalMarks: 50,
    duration: "2 Hours",
    topicsCovered: ["C/C++ Pointers", "Linked List Insertion/Deletion", "Queue Using Arrays"],
    downloadUrl: "https://procode.edu/papers/dsa-lab-2024.pdf",
    description: "Lab practical question bank with 12 classic viva examination prompts and C/C++ memory management requirements."
  },
  {
    _id: "paper_2023_endsem",
    title: "DSA End-Semester Examination 2023",
    subject: "Data Structures & Algorithms",
    courseCode: "CS-201",
    year: 2023,
    examType: "End-Semester",
    semester: "Semester 2",
    totalMarks: 100,
    duration: "3 Hours",
    topicsCovered: ["Graphs", "Binary Search Trees", "Hashing", "QuickSort Partitioning"],
    downloadUrl: "https://procode.edu/papers/dsa-endsem-2023.pdf",
    description: "Previous year paper focusing on AVL Trees rotation, Infix-to-Postfix step table, and QuickSort partitioning."
  }
];

const initialUsers = [
  {
    _id: "usr_admin",
    name: "Faculty Administrator",
    email: "admin@procode.edu",
    passwordHash: bcrypt.hashSync("Admin@123", 10),
    role: "admin",
    batch: "Faculty / Host",
    alias: "HostAdmin",
    careerPoints: 0,
    rankTier: "Bronze",
    solvedProblems: [],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ProCodeHost"
  }
];

const initialSubmissions = [];

async function seedDatabase(db) {
  const pCount = await db.Problem.countDocuments();
  if (pCount === 0) {
    console.log('Seeding initial DSA problems...');
    for (const p of initialProblems) await db.Problem.create(p);
  }

  const nCount = await db.Note.countDocuments();
  if (nCount === 0) {
    console.log('Seeding exam concept notes...');
    for (const n of initialNotes) await db.Note.create(n);
  }

  const papCount = await db.Paper.countDocuments();
  if (papCount === 0) {
    console.log('Seeding previous year question papers...');
    for (const pap of initialPapers) await db.Paper.create(pap);
  }

  const uCount = await db.User.countDocuments();
  if (uCount === 0) {
    console.log('Seeding demo college students and admin...');
    for (const u of initialUsers) await db.User.create(u);
    for (const s of initialSubmissions) await db.Submission.create(s);
  }
}

function calculateTier(points) {
  if (points >= 3000) return 'Conqueror';
  if (points >= 1500) return 'Diamond';
  if (points >= 700) return 'Platinum';
  if (points >= 300) return 'Gold';
  if (points >= 80) return 'Silver';
  return 'Bronze';
}

module.exports = {
  seedDatabase,
  calculateTier,
  initialProblems,
  initialNotes,
  initialPapers,
  initialUsers,
  initialSubmissions
};
