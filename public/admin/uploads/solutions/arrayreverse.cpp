#include <iostream>
using namespace std;
int main() {
  int N;
  int Arr[10000];
  cin >> N;
  for (int i = 0; i < N; i++) {
    cin >> Arr[i];
  }
  for (int i = N - 1; i >= 0; i--) {
    cout << Arr[i] << " ";
  }
  return 0;
}
