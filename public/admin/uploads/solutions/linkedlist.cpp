#include <iostream>
using namespace std;
int main() {
  int N;
  int Arr[10000];
  cin >> N;
  for (int i = 0; i < N; i++) {
    cin >> Arr[i];
  }
  for (int i=0;i<N;i++) {
    cout << Arr[i] << endl;
  }
  return 0;
}
